# mediacom-internet-usage

This package is used to scrape the usage data from mediacom's website.

#### Example usage:

```
docker run --rm \
-e ACCOUNT_NUMBER=<account_number> \
-e ZIP_CODE=<zip_code> \
eyeruleall/mediacom-internet-usage
```

#### Example results:

```
{
  percent: 60,
  allowed: 4000,
  upload: 355,
  download: 2046,
  total: 2401
}
```
