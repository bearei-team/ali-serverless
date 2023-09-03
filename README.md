# Ali serverless

Alibaba Cloud serverless function invocation client

## Installation

> yarn add @bearei/ali-serverless --save

## Parameters

## Use

```typescript
import { createClient } from '@bearei/ali-serverless';

await client.invoke.httpTrigger('https://bearei.com').then(result =>
  console.info(result);
);
```
