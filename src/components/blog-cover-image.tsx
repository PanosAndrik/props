type Props = {
  src: string;
  alt?: string;
  className?: string;
  priority?: boolean;
};

/** Renders blog cover images (local /uploads or external URLs) without Next/Image restrictions. */
export function BlogCoverImage({ src, alt = "", className }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} />
  );
}
