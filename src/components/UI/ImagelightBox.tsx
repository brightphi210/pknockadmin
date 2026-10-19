import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type LightboxImage = {
    url: string;
    caption?: string;
};

type Props = {
    images: LightboxImage[];
    /** Index to open at. `null` keeps the viewer closed. */
    startIndex: number | null;
    /** Called with the last viewed index when the viewer closes. */
    onClose: (lastIndex: number) => void;
};

const DURATION = 250; // ms, keep in sync with the transition classes below

const ImageLightbox = ({ images, startIndex, onClose }: Props) => {
    const open = startIndex !== null && images.length > 0;

    const [mounted, setMounted] = useState(false); // in the DOM
    const [visible, setVisible] = useState(false); // animated "open" state
    const [index, setIndex] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const touchStartX = useRef<number | null>(null);

    /* Open / close lifecycle: mount first, animate in on the next frames;
       on close animate out, then unmount. */
    useEffect(() => {
        if (open) {
            setIndex(Math.min(startIndex as number, images.length - 1));
            setLoaded(false);
            setMounted(true);
            const raf = requestAnimationFrame(() =>
                requestAnimationFrame(() => setVisible(true))
            );
            return () => cancelAnimationFrame(raf);
        }
        setVisible(false);
        const timer = setTimeout(() => setMounted(false), DURATION);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, startIndex]);

    const close = useCallback(() => onClose(index), [onClose, index]);

    const goTo = useCallback(
        (next: number) => {
            if (images.length < 2) return;
            setLoaded(false);
            setIndex((next + images.length) % images.length);
        },
        [images.length]
    );
    const prev = useCallback(() => goTo(index - 1), [goTo, index]);
    const next = useCallback(() => goTo(index + 1), [goTo, index]);

    /* Keyboard: Esc closes, arrows navigate */
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
            else if (e.key === "ArrowLeft") prev();
            else if (e.key === "ArrowRight") next();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, close, prev, next]);

    if (!mounted || !images.length) return null;

    const current = images[Math.min(index, images.length - 1)];
    const multiple = images.length > 1;

    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
            className={`fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm transition-opacity duration-[250ms] ease-out motion-reduce:transition-none ${visible ? "opacity-100" : "opacity-0"
                }`}
            onTouchStart={(e) => {
                touchStartX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
                if (touchStartX.current === null) return;
                const diff = e.changedTouches[0].clientX - touchStartX.current;
                touchStartX.current = null;
                if (Math.abs(diff) > 50) (diff > 0 ? prev : next)();
            }}
        >
            {/* Top bar */}
            <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4 text-white">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
                    {index + 1} / {images.length}
                </span>
                <button
                    type="button"
                    onClick={close}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                    aria-label="Close image viewer"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Image area (click empty space to close) */}
            <div
                className="absolute inset-0 flex items-center justify-center px-4 pb-28 pt-16 sm:px-20"
                onClick={(e) => {
                    if (e.target === e.currentTarget) close();
                }}
            >
                <img
                    key={current.url}
                    src={current.url}
                    alt={current.caption || `Photo ${index + 1}`}
                    onLoad={() => setLoaded(true)}
                    draggable={false}
                    className={`max-h-full max-w-full select-none rounded-lg object-contain shadow-2xl transition-all duration-[250ms] ease-out motion-reduce:transition-none ${visible && loaded ? "scale-100 opacity-100" : "scale-90 opacity-0"
                        }`}
                />
            </div>

            {/* Prev / next */}
            {multiple && (
                <>
                    <button
                        type="button"
                        onClick={prev}
                        className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
                        aria-label="Previous image"
                    >
                        <ChevronLeft size={22} />
                    </button>
                    <button
                        type="button"
                        onClick={next}
                        className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
                        aria-label="Next image"
                    >
                        <ChevronRight size={22} />
                    </button>
                </>
            )}

            {/* Caption + thumbnails */}
            <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-3 p-4">
                {current.caption && (
                    <p className="rounded-full bg-white/10 px-3 py-1 text-xs text-white">
                        {current.caption}
                    </p>
                )}
                {multiple && (
                    <div className="flex max-w-full gap-2 overflow-x-auto">
                        {images.map((img, i) => (
                            <button
                                key={img.url}
                                type="button"
                                onClick={() => goTo(i)}
                                className={`h-12 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all ${i === index
                                    ? "border-white opacity-100"
                                    : "border-transparent opacity-50 hover:opacity-80"
                                    }`}
                                aria-label={`View photo ${i + 1}`}
                            >
                                <img src={img.url} alt="" className="h-full w-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default ImageLightbox;