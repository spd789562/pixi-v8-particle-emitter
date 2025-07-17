import Counter from '@/components/Counter';
import { NumberInput } from '@repo/ui';

export default function Home() {
  return (
    <main>
      <h1 class="text-hue">Hello Web!</h1>
      <Counter />
      <div class="w-[300px] flex">
        <NumberInput label="test" format={false} />
      </div>
    </main>
  );
}
