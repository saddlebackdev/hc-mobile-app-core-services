# Analytics Service

This service is to be used for capturing analytics data. It is a
wrapper around AppInsights and can be used to send custom events and
metrics.

## Usage

### Initialising

```ts
import { AnalyticsService } from 'hc-mobile-app-core-services';

const analyticsInstance = AnalyticsService.createAnalyticsInstance({
  apiKey: 'YOUR_API_KEY',
});
```

### Enabling/Disabling Analytics

```ts
analyticsInstance.enable();

analyticsInstance.disable();
```

### Sending Events

#### trackEvent

```ts
analyticsInstance.trackEvent({
  name: 'Event Name',
  properties: {
    // Custom properties
  },
});
```

#### trackPageView

```ts
analyticsInstance.trackPageView({
  name: 'Page Name',
  properties: {
    // Custom properties
  },
});
```

#### trackException

```ts
analyticsInstance.trackException({
  exception: new Error('Error Message'),
  properties: {
    // Custom properties
  },
});
```

### AppInsights Instance

The created analytics instance also exports the AppInsights instance
that it is using. This can be used to access the AppInsights API
directly.

```ts
analyticsInstance.instance.trackMetrics({
  name: 'Event Name',
  properties: {
    // Custom properties
  },
});
```
