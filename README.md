# mediacom-internet-usage

This package is used to scrape the usage data from mediacom's website.

#### Example usage:

##### Note: username must include @mediacombb.net

```
docker exec -t --rm \
-e MEDIACOM_USER=<username> \
-e MEDIACOM_PASS=<password> \
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
