import { useCountUp, formatNumber } from '../../hooks/useCountUp';

/**
 * مكون عرض رقم متحرك
 */
function AnimatedCounter({ 
    end, 
    suffix = '', 
    useK = true, 
    duration = 2000,
    decimals = 0 
}) {
    const { count, ref } = useCountUp(end, duration);

    const displayValue = useK 
        ? formatNumber(count, suffix)
        : `${count.toFixed(decimals)}${suffix}`;

    return (
        <span 
            ref={ref} 
            className="animated-counter"
            style={{ 
                direction: 'ltr', 
                display: 'inline-block',
                unicodeBidi: 'isolate'
            }}
        >
            {displayValue}
        </span>
    );
}

export default AnimatedCounter;