// Minimal shim for @platform/framework/workflows-sdk
// Provides a tiny API surface used by legacy workflow orchestrator code

export type FlowRunOptions<TInput = unknown> = {
  input?: TInput
  throwOnError?: boolean
  logOnError?: boolean
  resultFrom?: string
  context?: any
  events?: any
  container?: any
}

export type WorkflowRunResult<TResult = unknown> = {
  result?: TResult
  errors?: unknown[]
  transaction: {
    getFlow(): any
    hasFinished(): boolean
    state?: any
  }
}

export type ReturnWorkflow<TInput = unknown, TResult = unknown, TContext = unknown> = {
  getName(): string
  run(options: FlowRunOptions<TInput> & { context?: TContext }): Promise<WorkflowRunResult<TResult>>
}

// Extremely small workflow registry to mimic MedusaWorkflow behavior
export class MedusaWorkflow {
  private static registry = new Map<string, ReturnWorkflow<any, any, any>>()

  static register(workflow: ReturnWorkflow<any, any, any>) {
    const name = workflow?.getName?.()
    if (!name) return
    MedusaWorkflow.registry.set(name, workflow)
  }

  static getWorkflow<TInput = any, TResult = any, TContext = any>(
    name: string
  ): ReturnWorkflow<TInput, TResult, TContext> | undefined {
    return MedusaWorkflow.registry.get(name) as any
  }
}

export async function resolveValue<T>(valueOrFn: T | (() => T | Promise<T>)): Promise<T> {
  if (typeof valueOrFn === 'function') {
    // @ts-ignore
    return await (valueOrFn as any)()
  }
  return valueOrFn as T
}
