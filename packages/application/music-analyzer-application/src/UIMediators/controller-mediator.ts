import { Controller } from "@music-analyzer/controllers";

export abstract class ControllerMediator<Subscriber> {
  protected readonly subscribers: Subscriber[] = [];
  constructor(
    protected readonly publisher: Controller[],
  ) {
    this.init(publisher);
  }
  register(...e: Subscriber[]) { this.subscribers.push(...e) }
  abstract update(): void
  abstract init(controllers: Controller[]): void;
}
