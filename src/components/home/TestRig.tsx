import { useEffect, useRef, useState } from 'react';
import { Play, Square } from 'lucide-react';
import BuggyBlueprint from '@/components/brand/BuggyBlueprint';
import { terrain, FRONT_AXLE_X, REAR_AXLE_X, type RigPose } from '@/components/brand/rig';
import type { SubsystemId } from '@/data/club';
import { cn } from '@/lib/utils';

const REST: RigPose = { front: 0, rear: 0, heave: 0, dist: 0, amp: 0 };

const SPEED = 190; // drawing units per second at full speed
const SPRING = 10; // natural frequency of the sprung mass, rad/s
const DAMPING = 0.32; // under-damped on purpose, so the body visibly rides the springs

/**
 * A small ride simulation. The wheels follow the track, and the sprung mass
 * is a damped spring chasing the average wheel height. Starting and stopping
 * both ease, so the drawing always settles back to its rest pose.
 */
function useTestRig(running: boolean) {
  const [pose, setPose] = useState<RigPose>(REST);
  const sim = useRef({ dist: 0, amp: 0, heave: 0, vel: 0 });

  useEffect(() => {
    const s = sim.current;
    if (!running && s.amp === 0) return;
    let raf = 0;
    let last = performance.now();

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      s.amp += ((running ? 1 : 0) - s.amp) * Math.min(1, dt * 2.6);
      s.dist += SPEED * s.amp * dt;
      const front = s.amp * terrain(FRONT_AXLE_X + s.dist);
      const rear = s.amp * terrain(REAR_AXLE_X + s.dist);

      const target = (front + rear) / 2;
      s.vel += (SPRING * SPRING * (target - s.heave) - 2 * DAMPING * SPRING * s.vel) * dt;
      s.heave += s.vel * dt;

      const settled = !running && s.amp < 0.004 && Math.abs(s.heave) < 0.05 && Math.abs(s.vel) < 0.5;
      if (settled) {
        s.amp = 0;
        s.heave = 0;
        s.vel = 0;
        setPose({ ...REST, dist: s.dist });
        return;
      }
      setPose({ front, rear, heave: s.heave, dist: s.dist, amp: s.amp });
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  return pose;
}

/** Suspension travel at one axle: bump to the right of centre, rebound to the left. */
function TravelGauge({ label, value }: { label: string; value: number }) {
  const pct = Math.max(-1, Math.min(1, value / 20)) * 50;
  return (
    <span className="flex items-center gap-2">
      <span className="label-mono text-[10px] text-muted-foreground">{label}</span>
      <span className="relative block h-2 w-16 sm:w-20 border border-border bg-background">
        <span className="absolute inset-y-0 left-1/2 w-px bg-bone/40" />
        <span
          className="absolute inset-y-0 bg-energy"
          style={pct >= 0 ? { left: '50%', width: `${pct}%` } : { right: '50%', width: `${-pct}%` }}
        />
      </span>
    </span>
  );
}

/**
 * The anatomy drawing plus its test rig. Owns the animation frame loop so the
 * rest of the section doesn't re-render sixty times a second.
 */
export default function TestRig({
  active,
  onSelect,
  running,
  onToggle,
}: {
  active: SubsystemId | null;
  onSelect: (id: SubsystemId) => void;
  running: boolean;
  onToggle: () => void;
}) {
  const pose = useTestRig(running);
  const live = pose.amp > 0;

  return (
    <>
      <div className="crop-marks">
        <div className="relative border border-border bg-graphite/60 p-3 sm:p-6">
          <div className="absolute inset-0 drafting-grid opacity-70 pointer-events-none" aria-hidden />
          <BuggyBlueprint active={active} onSelect={onSelect} rig={pose} className="relative" />
          <span
            className={cn(
              'absolute top-3 right-3 sm:top-5 sm:right-5 flex items-center gap-2 label-mono text-[10px] transition-opacity duration-300',
              live ? 'opacity-100 text-energy' : 'opacity-0'
            )}
            aria-hidden
          >
            <span className="w-1.5 h-1.5 rounded-full bg-energy animate-blink" />
            Rig running
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={running}
          className={cn(
            'group h-11 px-4 flex items-center gap-2.5 font-display font-bold uppercase tracking-wide transition-colors',
            running
              ? 'bg-energy text-white hover:bg-energy-dark'
              : 'border border-foreground/30 hover:bg-foreground hover:text-background'
          )}
        >
          {running ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          {running ? 'Stop the rig' : 'Run the test rig'}
        </button>
        <div className={cn('flex items-center gap-5 transition-opacity duration-300', live ? 'opacity-100' : 'opacity-40')} aria-hidden>
          <TravelGauge label="Rear" value={pose.rear - pose.heave} />
          <TravelGauge label="Front" value={pose.front - pose.heave} />
        </div>
      </div>
      <p className="label-mono text-[10px] text-muted-foreground mt-4">
        Fig. 2: Schematic side elevation, not to scale. Pick a system, or run the rig to watch the suspension work.
      </p>
    </>
  );
}
