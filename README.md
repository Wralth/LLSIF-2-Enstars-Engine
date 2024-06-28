# Sonolus LLSIF 2 Ensemble Stars Engine

A recreation of Ensemble Stars!! Music engine in [Sonolus](https://sonolus.com) based on the LLSIF Engine by NonSpicyBurrito at https://github.com/NonSpicyBurrito/sonolus-llsif-engine.

## Links

-   [Sonolus Website](https://sonolus.com)
-   [Sonolus Wiki](https://github.com/NonSpicyBurrito/sonolus-wiki)

## Installation

```
npm install sonolus-llsif-engine
```

## Custom Resources

### Skin Sprites

| Name                      |
| ------------------------- |
| `LLSIF Connection Active` |

## Documentation

### `version`

Package version.

### `databaseEngineItem`

Partial database engine item compatible with [sonolus-express](https://github.com/NonSpicyBurrito/sonolus-express).

### `engineConfigurationPath`

Path to Engine Configuration file.

### `enginePlayDataPath`

Path to Engine Play Data file.

### `engineWatchDataPath`

Path to Engine Watch Data file.

### `enginePreviewDataPath`

Path to Engine Preview Data file.

### `engineTutorialDataPath`

Path to Engine Tutorial Data file.

### `engineThumbnailPath`

Path to Engine Thumbnail file.

### `nssToSIFC(nss)`

Converts NSS (note setting asset) to SIFC (SIF Chart).

-   `nss`: note setting asset.

### `sifcToLevelData(chart, offset?)`

Converts SIFC (SIF Chart) to Level Data.

-   `chart`: SIF Chart.
-   `offset`: offset (default: `0`).
