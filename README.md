# nerdpack-comp - Performance Monitoring Dashboard

A New Relic Nerdpack application for monitoring transaction performance metrics with percentile analysis.

## Overview

This Nerdpack provides a dashboard for visualizing APM transaction performance data including call counts, average duration, and percentile distributions (p50, p75, p95, p99) for your applications.

## Features

- Real-time transaction performance monitoring
- Percentile-based performance analysis (50th, 75th, 95th, and 99th percentiles)
- Account-aware data querying
- Auto-refresh capability (60-second polling interval)
- Comprehensive error handling and loading states
- User-friendly empty state messages

## Project Structure

```
nerdpack-comp/
├── nerdlets/
│   └── home/
│       ├── index.js        # Main dashboard component
│       └── nr1.json        # Nerdlet configuration
├── launchers/
│   └── launcher/
│       └── nr1.json        # Launcher configuration
├── nr1.json               # Nerdpack metadata
└── package.json           # Project dependencies and scripts
```

## Prerequisites

- New Relic account with APM data
- Node.js and npm installed
- New Relic One CLI (`nr1`) installed
- Access to New Relic One platform

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Development

Start the development server:

```bash
npm start
```

This will:
- Start the Nerdpack in development mode
- Enable hot-reload for file changes
- Make the app available at: https://dev-one.newrelic.com/?nerdpacks=local
- Start webpack bundle analyzer at: http://127.0.0.1:27888

### Production Mode

To test how assets will look in production:

```bash
npm start -- --mode=prod
```

## Components

### Home Nerdlet

**Location**: [nerdlets/home/index.js](nerdlets/home/index.js)

The main dashboard component that displays transaction performance data.

#### Key Features:

- **Account Context**: Automatically retrieves the selected account ID from platform state
- **NRQL Query**: Executes performance queries against the Transaction event type
- **Data Visualization**: Uses TableChart to display transaction metrics
- **Error Handling**: Provides clear error messages and debugging information
- **Empty States**: Helpful guidance when no data is available

#### Metrics Displayed:

| Metric | Description |
|--------|-------------|
| Calls | Total number of transaction calls |
| Avg Duration | Average transaction duration |
| p50 | 50th percentile (median) duration |
| p75 | 75th percentile duration |
| p95 | 95th percentile duration |
| p99 | 99th percentile duration |
| max | Maximum duration observed |

#### NRQL Query:

```sql
SELECT
  count(*) as 'Calls',
  average(duration) as 'Avg Duration',
  percentile(duration, 50) as 'p50',
  percentile(duration, 75) as 'p75',
  percentile(duration, 95) as 'p95',
  percentile(duration, 99) as 'p99',
  max(duration) as 'max'
FROM Transaction
FACET name
LIMIT 100
SINCE 1 hour ago
```

### Launcher Configuration

**Location**: [launchers/launcher/nr1.json](launchers/launcher/nr1.json)

- **Display Name**: Performance Monitor
- **Description**: Monitor transaction performance metrics with percentiles
- **Root Nerdlet**: home

## Configuration

### Nerdpack Metadata

- **UUID**: `420c9433-218d-4560-9353-206315ccc2b7`
- **Display Name**: nerdpack-comp
- **Schema Version**: NERDPACK

### Dependencies

- **React**: 17.0.2
- **React DOM**: 17.0.2
- **PropTypes**: 15.7.2

### Browser Support

- Last 2 versions of major browsers
- IE 11+ (excluding IE < 11)
- Excludes dead browsers

## Usage

1. Launch the application from the New Relic One Apps menu
2. Select an account using the account picker at the top
3. View transaction performance metrics in the table
4. Data refreshes automatically every 60 seconds

### No Data Available?

If you see "No Transaction Data Found", try:
- Ensure your application is sending data to New Relic APM
- Verify the correct account is selected
- Check that transactions occurred in the last hour
- Try selecting a different account from the account picker

## Debugging

The application includes console logging for debugging:
- Application load status
- Account ID information
- Platform state details
- Query results (data, loading, error states)

Check your browser's developer console for detailed information.

## Publishing

To publish this Nerdpack to New Relic:

```bash
nr1 nerdpack:publish
nr1 nerdpack:deploy
nr1 nerdpack:subscribe
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm test` | Run tests (currently exits with 0) |

## Customization

### Modifying the Time Window

Change the `SINCE` clause in the NRQL query (line 65 of [nerdlets/home/index.js](nerdlets/home/index.js)):

```javascript
SINCE 1 hour ago  // Change to: SINCE 24 hours ago, SINCE 7 days ago, etc.
```

### Adjusting Poll Interval

Modify the `pollInterval` prop (line 67):

```javascript
pollInterval={60000}  // 60 seconds (in milliseconds)
```

### Changing Result Limit

Update the `LIMIT` clause in the NRQL query:

```javascript
LIMIT 100  // Change to desired number
```

## Architecture

This Nerdpack follows New Relic's standard architecture:

1. **Nerdlet**: The main application component (Home)
2. **Launcher**: Entry point for accessing the application
3. **NR1 SDK Components**: Uses official New Relic One SDK components:
   - Grid/GridItem for layout
   - Card/CardBody for containers
   - TableChart for data visualization
   - NrqlQuery for data fetching
   - PlatformStateContext for account information

## Troubleshooting

### Server won't start

- Ensure `nr1` CLI is installed: `npm install -g @newrelic/nr1-cli`
- Check that you're logged in: `nr1 profiles:list`

### No data showing

- Verify APM agent is installed and reporting
- Check account permissions
- Ensure transactions exist in the selected time range

### Build errors

- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version compatibility

## License

Private project

## Support

For issues with this Nerdpack, contact the development team.
For New Relic platform issues, visit: https://support.newrelic.com