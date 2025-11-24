"use client";

import { useRef } from "react";
import VignetteLayer, { vignetteMaterialRef } from "@/components/VignetteLayer";
import { useLenis } from "@/lib/useLenis";
import gsap from "gsap";

export default function Page() {
    // We use a ref to store the timeline or tween if needed, 
    // but for simple direct mapping we can just set the value.
    const textContainerRef = useRef<HTMLDivElement>(null);

    const lenisRef = useLenis((e) => {
        const mat = vignetteMaterialRef.current;
        if (!mat) return;

        // Calculate progress (0 at top, 1 at bottom)
        // e.scroll is current scroll position
        // e.limit is max scroll position
        const progress = e.limit ? e.scroll / e.limit : 0;

        // Map progress to radius
        // Start: 0.8 (wide)
        // End: 0.1 (tight, almost black)
        // We can use gsap.utils.mapRange or just simple math
        // Let's make it close in more aggressively in the second half if we want

        // Responsive multiplier: slower on smaller screens (< 1024px)
        const isSmallScreen = window.innerWidth < 1024;
        const multiplier = isSmallScreen ? 0.3 : 0.5;

        // Map progress to radius
        const targetRadius = 0.8 - (progress * multiplier);

        // Smoothly animate to the target value to avoid jitter
        gsap.to(mat.uniforms.uRadius, {
            value: targetRadius,
            duration: 0.1,
            overwrite: true,
            ease: "power1.out"
        });

        // Also increase intensity slightly?
        // mat.uniforms.uIntensity.value = 1.0 + progress * 0.5;

        // Text Fade Out Logic
        // Create a gradient fade from top to bottom
        // Slowed down version - starts later and progresses more gradually
        if (textContainerRef.current) {
            const fadeStart = 0.5;  // Start later (was 0.4)
            const fadeEnd = 1.2;    // Extend beyond full scroll

            if (progress > fadeStart) {
                // Normalize progress between 0 and 1 for the fade range
                const fadeProgress = Math.min((progress - fadeStart) / (fadeEnd - fadeStart), 1);

                // Create a gradient that moves down as you scroll
                // fadeProgress 0 -> gradient starts at 0%
                // fadeProgress 1 -> gradient covers everything (fully transparent)
                const gradientStart = fadeProgress * 100;
                const gradientEnd = gradientStart + 50; // Wider gradient range (was 30%)

                gsap.set(textContainerRef.current, {
                    maskImage: `linear-gradient(to bottom, transparent ${gradientStart}%, black ${gradientEnd}%)`,
                    WebkitMaskImage: `linear-gradient(to bottom, transparent ${gradientStart}%, black ${gradientEnd}%)`
                });
            } else {
                // Reset mask when not in fade range
                gsap.set(textContainerRef.current, {
                    maskImage: 'none',
                    WebkitMaskImage: 'none'
                });
            }

            // Infinite Scroll Loop
            if (progress > 0.99) {
                lenisRef.current?.scrollTo(0, { immediate: true });
            }
        }
    });

    return (
        <div className="relative min-h-screen w-full bg-white text-black font-sans">
            <VignetteLayer />

            <div className="relative z-10 p-8 md:p-16 overflow-hidden">
                <div ref={textContainerRef} className="max-w-2xl mx-auto flex flex-col gap-8 text-base md:text-lg leading-relaxed pb-[50vh]">
                    <section className="space-y-4 pt-20">
                        <p className="uppercase tracking-widest text-xs text-gray-400">THE DOORS CAN OPEN THE WRONG WAY</p>
                        <p className="uppercase tracking-widest text-xs text-gray-400">REFINED DRAFT (still experimental, but elevated)</p>
                    </section>

                    <section className="space-y-4">
                        <p>Meaning had never been a function to him. It was a place, and he was the only one who seemed to live there.</p>
                    </section>

                    <section className="space-y-4">
                        <p>He’d always noticed the abnormalities.</p>
                        <p>Like fractures in the world.</p>
                        <p>Those quiet irregularities that came with a loud silence, piercing through his perception.</p>
                        <p>The kind of silence that doesn’t remove sound, it pierces veils.</p>
                    </section>

                    <section className="space-y-4">
                        <p>The boy asks you:</p>
                        <p>How do <i>you</i> think a door works?</p>
                    </section>

                    <section className="space-y-4">
                        <p>“It’s a simple pattern, no?”</p>
                        <p>It opens.</p>
                        <p>It closes.</p>
                        <p>It guides.</p>
                        <p>But <i>where</i> does it guide you? And <i>what</i> decides that?</p>
                    </section>

                    <section className="space-y-4">
                        <p>He wondered if the mind dictates what’s behind the door.</p>
                        <p>If the space beyond is always there, waiting patiently…</p>
                        <p>Or if it only exists once you choose to see it.</p>
                    </section>

                    <section className="space-y-4">
                        <p>He didn’t believe doors were loyal to their destinations.</p>
                        <p>He believed they were shells.</p>
                        <p>Layers built to hide whatever the universe didn’t want people to notice.</p>
                    </section>

                    <section className="space-y-4">
                        <p>When he touched a handle, he didn’t feel metal.</p>
                        <p>He felt emptiness.</p>
                        <p>A kind of structural hollowness. Like the door wasn’t attached to anything real, like it didn’t belong to a wall or a room but to some deeper, unspoken logic behind the world.</p>
                    </section>

                    <section className="space-y-4">
                        <p>He walked through life this way:</p>
                        <p>a quiet observer,</p>
                        <p>collecting patterns,</p>
                        <p>never invited to speak them aloud.</p>
                    </section>

                    <section className="space-y-4">
                        <p>Then came the night time stopped behaving.</p>
                    </section>

                    <section className="space-y-4">
                        <p>He lay in bed, awake in a dark, cold room where silence pressed against his skin like a heavy atmosphere from another world. The only visible shape was the door, a pale outline, waiting. Not threatening. Not comforting. Just present, like it had finally acknowledged him.</p>
                    </section>

                    <section className="space-y-4">
                        <p>It felt less like he had permission to approach it, and more like the universe had stopped resisting the fact that he knew.</p>
                    </section>

                    <section className="space-y-4">
                        <p>He slid out of bed, legs first, his feet settling on a cold floor.</p>
                        <p>His heartbeat the only thing in the room that had a presence.</p>
                    </section>

                    <section className="space-y-4">
                        <p>The knob was cold.</p>
                        <p>Not normal cold, <i>aggressively</i> cold.</p>
                        <p>Cold that refused to warm beneath his touch, as if heat did not exist on the other side.</p>
                    </section>

                    <section className="space-y-4">
                        <p>A moment of profound stillness settled over everything.</p>
                        <p>For a breath, reality held itself in suspension.</p>
                        <p>Then the “what if” he had carried his whole life discretely resolved into “what is.”</p>
                    </section>

                    <section className="space-y-4">
                        <p>The door, which had only ever opened properly before, gave way and opened <i>backwards</i>.</p>
                    </section>

                    <section className="space-y-4">
                        <p>Not like a hinge moving.</p>
                        <p>More like a lock being undone.</p>
                        <p><i>(Like something finally giving up its lie.)</i></p>
                    </section>

                    <section className="space-y-4">
                        <p>And on the other side was not his hallway.</p>
                        <p>Yet visually, it was identical.</p>
                    </section>

                    <section className="space-y-4">
                        <p>Only… <i>off</i>.</p>
                        <p>Like a recording of his hallway.</p>
                        <p>A live loop.</p>
                        <p>Someone else’s surveillance footage of a place he’d walked a thousand times.</p>
                    </section>

                    <section className="space-y-4">
                        <p>Stillness takes on a new definition here.</p>
                        <p>It isn’t lack of noise.</p>
                        <p>It’s the absence of sound as a form, the same way an image is absent of touch.</p>
                    </section>

                    <section className="space-y-4">
                        <p>It feels like stepping into the backside of the world. The part that isn’t meant to be walked, only observed.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
