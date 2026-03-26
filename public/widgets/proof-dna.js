/**
 * Satohash "Proof DNA" Widget (Vision 2.0 - Item 7)
 * Usage: <div class="satohash-dna" data-hash="HASH_HERE"></div>
 *        <script src="/widgets/proof-dna.js"></script>
 */

(function() {
    const widgets = document.querySelectorAll('.satohash-dna');
    
    widgets.forEach(widget => {
        const hash = widget.getAttribute('data-hash');
        if (!hash) return;

        // Generate deterministic colors from hash
        const colors = [
            `#${hash.substring(0, 6)}`,
            `#${hash.substring(6, 12)}`,
            `#${hash.substring(12, 18)}`
        ];

        widget.style.width = '64px';
        widget.style.height = '64px';
        widget.style.borderRadius = '16px';
        widget.style.position = 'relative';
        widget.style.overflow = 'hidden';
        widget.style.cursor = 'help';
        widget.style.background = `linear-gradient(45deg, ${colors[0]}, ${colors[1]})`;
        widget.style.boxShadow = `0 10px 30px ${colors[0]}44`;
        widget.title = `Satohash DNA: ${hash.substring(0, 20)}...`;

        // Inner glowing layer
        const layer = document.createElement('div');
        layer.style.position = 'absolute';
        layer.style.inset = '4px';
        layer.style.borderRadius = '12px';
        layer.style.border = `1px solid ${colors[2]}44`;
        layer.style.background = 'rgba(255,255,255,0.05)';
        layer.style.pointerEvents = 'none';

        widget.appendChild(layer);

        // Hover Effect
        widget.onmouseenter = () => {
            widget.style.transform = 'scale(1.1)';
            widget.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        };
        widget.onmouseleave = () => {
             widget.style.transform = 'scale(1)';
        };
    });
})();
