import React from 'react';
import {
  Grid,
  GridItem,
  HeadingText,
  TableChart,
  NrqlQuery,
  Spinner,
  Stack,
  StackItem,
  Card,
  CardBody,
  PlatformStateContext,
} from 'nr1';

export default class HomeNerdlet extends React.Component {
  render() {
    return (
      <PlatformStateContext.Consumer>
        {(platformState) => {
          const accountId = platformState.accountId;

          console.log('App is loading!');
          console.log('Account ID:', accountId);
          console.log('Platform State:', platformState);

          return (
            <div className="container">
              <Grid className="primary-grid">
                <GridItem columnSpan={12}>
                  <Stack
                    directionType={Stack.DIRECTION_TYPE.VERTICAL}
                    gapType={Stack.GAP_TYPE.LARGE}
                  >
                    <StackItem>
                      <HeadingText type={HeadingText.TYPE.HEADING_1}>
                        Performance Monitoring Dashboard
                      </HeadingText>
                      <p style={{ color: '#e3e4e6', marginTop: '10px' }}>
                        Account ID: {accountId || 'No account selected'}
                      </p>
                    </StackItem>

                    {accountId ? (
                      <StackItem>
                        <Card>
                          <CardBody>
                            <HeadingText type={HeadingText.TYPE.HEADING_3}>
                              Transaction Performance Metrics
                            </HeadingText>
                            <NrqlQuery
                              accountIds={[accountId]}
                              query={`
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
                              `}
                              pollInterval={60000}
                            >
                              {({ data, loading, error }) => {
                                console.log('Query result:', { data, loading, error });

                                if (loading) {
                                  return (
                                    <div style={{ padding: '40px', textAlign: 'center' }}>
                                      <Spinner />
                                      <p style={{ color: '#e3e4e6', marginTop: '20px' }}>
                                        Loading transaction data...
                                      </p>
                                    </div>
                                  );
                                }

                                if (error) {
                                  return (
                                    <div style={{ padding: '20px' }}>
                                      <HeadingText type={HeadingText.TYPE.HEADING_4}>
                                        Error loading data
                                      </HeadingText>
                                      <p style={{ color: '#e3e4e6', marginTop: '10px' }}>
                                        {error.message || 'An error occurred'}
                                      </p>
                                      <pre style={{ color: '#8e9ba6', marginTop: '10px', fontSize: '12px' }}>
                                        {JSON.stringify(error, null, 2)}
                                      </pre>
                                    </div>
                                  );
                                }

                                if (!data || data.length === 0) {
                                  return (
                                    <div style={{ padding: '20px' }}>
                                      <HeadingText type={HeadingText.TYPE.HEADING_4}>
                                        No Transaction Data Found
                                      </HeadingText>
                                      <p style={{ color: '#e3e4e6', marginTop: '10px' }}>
                                        There is no transaction data available for this account in the last hour.
                                      </p>
                                      <p style={{ color: '#8e9ba6', marginTop: '10px' }}>
                                        Suggestions:
                                      </p>
                                      <ul style={{ color: '#8e9ba6', marginLeft: '20px' }}>
                                        <li>Make sure your application is sending data to New Relic APM</li>
                                        <li>Check if the correct account is selected (Account ID: {accountId})</li>
                                        <li>Try selecting a different account from the account picker at the top</li>
                                      </ul>
                                    </div>
                                  );
                                }

                                return (
                                  <div>
                                    <p style={{ color: '#e3e4e6', marginBottom: '10px' }}>
                                      Found {data.length} transactions
                                    </p>
                                    <TableChart
                                      data={data}
                                      fullWidth
                                      style={{ height: '600px' }}
                                    />
                                  </div>
                                );
                              }}
                            </NrqlQuery>
                          </CardBody>
                        </Card>
                      </StackItem>
                    ) : (
                      <StackItem>
                        <Card>
                          <CardBody>
                            <HeadingText type={HeadingText.TYPE.HEADING_4}>
                              No Account Selected
                            </HeadingText>
                            <p style={{ color: '#e3e4e6', marginTop: '10px' }}>
                              Please select an account using the account picker at the top of the page.
                            </p>
                          </CardBody>
                        </Card>
                      </StackItem>
                    )}
                  </Stack>
                </GridItem>
              </Grid>
            </div>
          );
        }}
      </PlatformStateContext.Consumer>
    );
  }
}
