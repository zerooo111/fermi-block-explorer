import { useEffect, useState } from "react";

interface AnimatedNumberProps {
	value: number;
	format?: { notation?: "standard" | "compact" };
	className?: string;
}

export function AnimatedNumber({
	value,
	format,
	className,
}: AnimatedNumberProps) {
	const [displayValue, setDisplayValue] = useState(value);

	useEffect(() => {
		const startValue = displayValue;
		const endValue = value;
		const duration = 500;
		const startTime = Date.now();

		const animate = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);
			// Easing function for smooth animation
			const easeOutQuart = 1 - Math.pow(1 - progress, 4);
			const currentValue = startValue + (endValue - startValue) * easeOutQuart;
			setDisplayValue(currentValue);

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				setDisplayValue(endValue);
			}
		};

		if (startValue !== endValue) {
			requestAnimationFrame(animate);
		}
	}, [value]);

	const formattedValue = format?.notation === "standard"
		? displayValue.toLocaleString("en-US", {
				notation: "standard",
				maximumFractionDigits: 0,
			})
		: displayValue.toLocaleString("en-US", {
				notation: format?.notation || "standard",
				maximumFractionDigits: 0,
			});

	return <span className={className}>{formattedValue}</span>;
}

