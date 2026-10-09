"use client";

import { XIcon } from "lucide-react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { Dialog as DialogPrimitive } from "radix-ui";
import {
  createContext,
  use,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";

import { Button } from "@/components/ui/button";
import { projectMomentum, rubberband } from "@/lib/gesture";
import { cn } from "@/lib/utils";

// Critically damped – the sheet never bounces away from the screen edge.
const spring = { type: "spring", stiffness: 320, damping: 36 } as const;

type DragHandlers = Pick<
  ComponentProps<"div">,
  "onPointerDown" | "onPointerMove" | "onPointerUp" | "onPointerCancel"
>;

interface OpenState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const OpenContext = createContext<OpenState>({
  open: false,
  setOpen: () => {},
});
const DragContext = createContext<DragHandlers>({});

/**
 * A sheet sliding up from the bottom edge. It follows the finger when dragged
 * by its handle or header, and closes when let go far or fast enough.
 */
export function BottomSheet({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <OpenContext value={{ open, setOpen }}>{children}</OpenContext>
    </DialogPrimitive.Root>
  );
}

export const BottomSheetTrigger = DialogPrimitive.Trigger;
export const BottomSheetClose = DialogPrimitive.Close;

export function BottomSheetContent(
  props: ComponentProps<typeof DialogPrimitive.Content>,
) {
  const { open } = use(OpenContext);

  // Motion runs the enter and exit animations, so Radix keeps everything
  // mounted until the exit has finished.
  return (
    <AnimatePresence>
      {open && (
        <DialogPrimitive.Portal forceMount>
          <SheetPanel {...props} />
        </DialogPrimitive.Portal>
      )}
    </AnimatePresence>
  );
}

function SheetPanel({
  className,
  children,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content>) {
  const { setOpen } = use(OpenContext);
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const gesture = useRef<{ pointerY: number; startY: number } | null>(null);
  // How far the sheet is dragged below its resting place, in px.
  const dragY = useMotionValue(0);
  // The backdrop clears up as the sheet is pulled away.
  const backdropOpacity = useTransform(
    dragY,
    (value) => 1 - value / (panelRef.current?.offsetHeight ?? Infinity),
  );
  // Speed of the flick that closed the sheet, in % of its height per second.
  const [exitVelocity, setExitVelocity] = useState(0);

  function release() {
    const panel = panelRef.current;
    if (!gesture.current || !panel) return;
    gesture.current = null;

    const velocity = dragY.getVelocity();
    const height = panel.offsetHeight;
    // Where the flick would carry the sheet decides, not where it was let go.
    if (dragY.get() + projectMomentum(velocity) > height / 2) {
      setExitVelocity((velocity / height) * 100);
      setOpen(false);
    } else {
      animate(dragY, 0, { ...spring, velocity });
    }
  }

  const dragHandlers: DragHandlers = {
    onPointerDown(event) {
      event.currentTarget.setPointerCapture(event.pointerId);
      dragY.stop(); // Catch the sheet mid-flight.
      gesture.current = { pointerY: event.clientY, startY: dragY.get() };
    },
    onPointerMove(event) {
      const panel = panelRef.current;
      if (!gesture.current || !panel) return;
      const offset =
        gesture.current.startY + event.clientY - gesture.current.pointerY;
      // Follows the finger down; pulled up, it resists more and more.
      dragY.set(
        offset >= 0 ? offset : -rubberband(-offset, panel.offsetHeight),
      );
    },
    onPointerUp: release,
    onPointerCancel: release,
  };

  return (
    <>
      <DialogPrimitive.Overlay forceMount asChild>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50"
        >
          <motion.div
            style={{ opacity: backdropOpacity }}
            className="size-full bg-black/30 supports-backdrop-filter:backdrop-blur-xs"
          />
        </motion.div>
      </DialogPrimitive.Overlay>

      {/* Slides the sheet in and out; dragging moves the panel inside it. */}
      <motion.div
        initial={reduceMotion ? { opacity: 0 } : { y: "100%" }}
        animate={{ y: 0, opacity: 1 }}
        exit={
          reduceMotion
            ? { opacity: 0 }
            : { y: "100%", transition: { ...spring, velocity: exitVelocity } }
        }
        transition={spring}
        className="fixed inset-x-0 bottom-0 z-50"
      >
        <DialogPrimitive.Content forceMount asChild {...props}>
          <motion.div
            ref={panelRef}
            style={{ y: dragY }}
            className={cn(
              "relative flex max-h-[85dvh] flex-col gap-4 rounded-t-3xl border-t bg-popover text-sm text-popover-foreground shadow-lg outline-none",
              // Fills the gap below the sheet when it is pulled up.
              "after:absolute after:inset-x-0 after:top-full after:h-full after:bg-inherit",
              className,
            )}
          >
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 flex h-6 cursor-grab touch-none justify-center pt-2 select-none active:cursor-grabbing"
              {...dragHandlers}
            >
              <span className="h-1.5 w-10 rounded-full bg-muted-foreground/30" />
            </div>
            <DragContext value={dragHandlers}>{children}</DragContext>
            <DialogPrimitive.Close asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="absolute top-5 right-3"
              >
                <XIcon />
                <span className="sr-only">Zamknij</span>
              </Button>
            </DialogPrimitive.Close>
          </motion.div>
        </DialogPrimitive.Content>
      </motion.div>
    </>
  );
}

/** The sheet can be dragged by its header as well as by the handle. */
export function BottomSheetHeader({
  className,
  ...props
}: ComponentProps<"div">) {
  const dragHandlers = use(DragContext);

  return (
    <div
      className={cn(
        "flex shrink-0 cursor-grab touch-none flex-col gap-0.5 px-4 pt-6 pb-4 select-none active:cursor-grabbing",
        className,
      )}
      {...dragHandlers}
      {...props}
    />
  );
}

export function BottomSheetTitle({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("font-heading text-base font-medium", className)}
      {...props}
    />
  );
}

export function BottomSheetFooter({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex shrink-0 flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}
