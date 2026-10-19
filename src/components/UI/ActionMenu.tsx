import { MoreVertical } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type ActionMenuItem = {
    label: string;
    onClick: () => void;
    tone?: "default" | "primary" | "danger" | "success";
    disabled?: boolean;
};

const MENU_WIDTH = 176;
const ITEM_HEIGHT = 38;
const MENU_PADDING = 10;
const GAP = 4;
const EDGE = 8;

const TONE_CLASS: Record<NonNullable<ActionMenuItem["tone"]>, string> = {
    default: "text-gray-700 hover:bg-gray-50",
    primary: "text-blue-600 hover:bg-blue-50",
    danger: "text-red-600 hover:bg-red-50",
    success: "text-green-600 hover:bg-green-50",
};

type Props = {
    open: boolean;
    onToggle: () => void;
    onClose: () => void;
    /** Custom menu entries. When provided, the legacy props below are ignored. */
    items?: ActionMenuItem[];
    /* Legacy props: View + Suspend/Reactivate */
    onView?: () => void;
    onSuspend?: () => void;
    onReactivate?: () => void;
    isActive?: boolean;
};

const ActionsMenu = ({
    open,
    onToggle,
    onClose,
    items,
    onView,
    onSuspend,
    onReactivate,
    isActive = true,
}: Props) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

    const menuItems: ActionMenuItem[] =
        items ??
        [
            ...(onView ? [{ label: "View", onClick: onView } as ActionMenuItem] : []),
            ...(isActive
                ? onSuspend
                    ? [{ label: "Suspend", onClick: onSuspend, tone: "danger" } as ActionMenuItem]
                    : []
                : onReactivate
                    ? [{ label: "Reactivate", onClick: onReactivate, tone: "success" } as ActionMenuItem]
                    : []),
        ];

    const menuHeight = menuItems.length * ITEM_HEIGHT + MENU_PADDING;

    // Position relative to the button; flip upward when there is no room below
    useLayoutEffect(() => {
        if (!open || !buttonRef.current) {
            setPos(null);
            return;
        }
        const rect = buttonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const openUp = spaceBelow < menuHeight + EDGE && rect.top > spaceBelow;

        const top = openUp ? rect.top - menuHeight - GAP : rect.bottom + GAP;
        const left = Math.min(
            Math.max(EDGE, rect.right - MENU_WIDTH),
            window.innerWidth - MENU_WIDTH - EDGE
        );
        setPos({ top, left });
    }, [open, menuHeight]);

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
                menuItems.length > 0 &&
                createPortal(
                    <div
                        ref={menuRef}
                        role="menu"
                        style={{ position: "fixed", top: pos.top, left: pos.left, width: MENU_WIDTH }}
                        className="z-50 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
                    >
                        {menuItems.map((item) => (
                            <button
                                key={item.label}
                                type="button"
                                role="menuitem"
                                disabled={item.disabled}
                                onClick={() => {
                                    item.onClick();
                                    onClose();
                                }}
                                className={`flex w-full items-center px-3 py-2 text-left text-sm disabled:cursor-not-allowed disabled:opacity-50 ${TONE_CLASS[item.tone ?? "default"]}`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>,
                    document.body
                )}
        </>
    );
};

export default ActionsMenu;