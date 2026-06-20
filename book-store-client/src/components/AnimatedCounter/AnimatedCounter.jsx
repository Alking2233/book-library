import { useCountUp, formatNumber } from '../../hooks/useCountUp';

function AnimatedCounter({ 
    end, 
    suffix = '', 
    useK = true, 
    duration = 2000,
    decimals = 0 
}) {
    const { count, ref } = useCountUp(end, duration);

    const numberPart = useK 
        ? formatNumber(count, '')
        : count.toFixed(decimals);

    return (
        <span 
            ref={ref} 
            className="animated-counter"
            dir="ltr"
            style={{ 
                direction: 'ltr',
                display: 'inline-block',
                unicodeBidi: 'bidi-override'
            }}
        >
            <bdi>{numberPart}{suffix}</bdi>
        </span>
    );
}

export default AnimatedCounter;