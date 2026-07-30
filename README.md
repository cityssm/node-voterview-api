# VoterView API for Node

[![DeepSource](https://app.deepsource.com/gh/cityssm/node-voterview-api.svg/?label=active+issues&show_trend=true&token=dlYSa6tCawJBplGPOzQzjiWW)](https://app.deepsource.com/gh/cityssm/node-voterview-api/)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=cityssm_node-voterview-api&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=cityssm_node-voterview-api)

**An unofficial wrapper around DataFix's [VoterView](https://datafix.com/services/voterview/) Online Voter Services REST API.**

## Features

- **Well typed** to get started quickly.
- **Built-in caching** of rarely updated values.
- **Documentation error fixes**. Less trial-and-error for you!
- **Easier application debugging** with pre-request validation.
- **Helper functions** to add features not part of the official API.

## Installation

```bash
npm install @cityssm/voterview-api
```

## Usage

```javascript
import { VoterViewApi } from '@cityssm/voterview-api'

const voterViewApi = new VoterViewApi(
  '9999',
  'voterViewUser',
  'voterViewPassword'
)

const candidates = await voterViewApi.getCandidateListByWard('01')

const streetAddresses = await getStreetAddresses('99 FO')
```

## Related Projects

[**Civic Address Format**](https://www.npmjs.com/package/@cityssm/civic-address-format)<br />
Formats a civic address from its pieces using Canada Post guidelines.

[**Statistics Canada (StatsCan) Tools for Node**](https://www.npmjs.com/package/@cityssm/statscan-tools)<br />
Lookups and utilities for working with Statistics Canada (StatsCan) data.

[**MPAC Tools from Node**](https://www.npmjs.com/package/@cityssm/mpac-tools)<br />
Lookups and utilities for working with MPAC data.
