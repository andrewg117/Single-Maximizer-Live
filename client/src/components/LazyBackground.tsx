import React, { useEffect, useRef, useState } from "react";

function LazyBackground({
  style,
  imageUrl,
  children,
}: {
  style: string;
  imageUrl: string;
  children: React.ReactNode;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const divRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.1 } // 0.1 means when 10% of the div is visible
    );

    if (divRef.current) {
      observer.observe(divRef.current);
    }

    return () => {
      if (divRef.current) {
        setIsVisible(false);
        observer.unobserve(divRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={divRef}
      className={style}
      style={{ backgroundImage: isVisible ? `url(${imageUrl})` : "none" }}
    >
      {children}
    </section>
  );
}

export default LazyBackground;
