import { MoreVertical } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const MENU_WIDTH = 160;
const MENU_HEIGHT = 90; // approx height of 2 items + padding
const GAP = 4;
const EDGE = 8;

type Props = {
    open: boolean;
    onToggle: () => void;
    onClose: () => void;
    onView: () => void;
    onSuspend: () => void;
    onReactivate: () => void;
    isActive: boolean;
};

const ActionsMenu = ({
    open,
    onToggle,
    onClose,
    onView,
    onSuspend,
    onReactivate,
    isActive,
}: Props) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

    // Position the menu relative to the button (flip up if no room below)
    useLayoutEffect(() => {
        if (!open || !buttonRef.current) {
            setPos(null);
            return;
        }
        const rect = buttonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const openUp = spaceBelow < MENU_HEIGHT + EDGE && rect.top > spaceBelow;

        const top = openUp ? rect.top - MENU_HEIGHT - GAP : rect.bottom + GAP;
        const left = Math.min(
            Math.max(EDGE, rect.right - MENU_WIDTH),
            window.innerWidth - MENU_WIDTH - EDGE
        );
        setPos({ top, left });
    }, [open]);

    // Close on outside click, scroll, resize or Escape
    useEffect(() => {
        if (!open) return;

        const onMouseDown = (e: MouseEvent) => {
            const target = e.target as Node;
            if (buttonRef.current?.contains(target)) return;
            if (menuRef.current?.contains(target)) return;
            onClose();
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("mousedown", onMouseDown);
        document.addEventListener("keydown", onKey);
        window.addEventListener("scroll", onClose, true);
        window.addEventListener("resize", onClose);
        return () => {
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("keydown", onKey);
            window.removeEventListener("scroll", onClose, true);
            window.removeEventListener("resize", onClose);
        };
    }, [open, onClose]);

    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                onClick={onToggle}
                className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                aria-label="Actions"
                aria-haspopup="menu"
                aria-expanded={open}
            >
                <MoreVertical size={18} />
            </button>

            {open &&
                pos &&
                createPortal(
                    <div
                        ref={menuRef}
                        role="menu"
                        style={{ position: "fixed", top: pos.top, left: pos.left, width: MENU_WIDTH }}
                        className="z-50 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
                    >
                        <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                                onView();
                                onClose();
                            }}
                            className="flex w-full items-center px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                        >
                            View
                        </button>
                        {isActive ? (
                            <button
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                    onSuspend();
                                    onClose();
                                }}
                                className="flex w-full items-center px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                            >
                                Suspend
                            </button>
                        ) : (
                            <button
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                    onReactivate();
                                    onClose();
                                }}
                                className="flex w-full items-center px-3 py-2 text-left text-sm text-green-600 hover:bg-green-50"
                            >
                                Reactivate
                            </button>
                        )}
                    </div>,
                    document.body
                )}
        </>
    );
};

export default ActionsMenu;