module.config({
    'name': 'Resize Digital\nOcean Droplet',
    'inputs': ['size', 'client id', 'droplet id', 'api key']
});

module.process(function() {
    var sizes = [{
        "id": 66,
        "name": "512MB",
        "slug": null,
        "memory": 512,
        "cpu": 1,
        "disk": 20,
        "cost_per_hour": 0.00744,
        "cost_per_month": "5.0"
    }, {
        "id": 63,
        "name": "1GB",
        "slug": null,
        "memory": 1024,
        "cpu": 1,
        "disk": 30,
        "cost_per_hour": 0.01488,
        "cost_per_month": "10.0"
    }, {
        "id": 62,
        "name": "2GB",
        "slug": null,
        "memory": 2048,
        "cpu": 2,
        "disk": 40,
        "cost_per_hour": 0.02976,
        "cost_per_month": "20.0"
    }, {
        "id": 64,
        "name": "4GB",
        "slug": null,
        "memory": 4096,
        "cpu": 2,
        "disk": 60,
        "cost_per_hour": 0.05952,
        "cost_per_month": "40.0"
    }, {
        "id": 65,
        "name": "8GB",
        "slug": null,
        "memory": 8192,
        "cpu": 4,
        "disk": 80,
        "cost_per_hour": 0.11905,
        "cost_per_month": "80.0"
    }, {
        "id": 61,
        "name": "16GB",
        "slug": null,
        "memory": 16384,
        "cpu": 8,
        "disk": 160,
        "cost_per_hour": 0.2381,
        "cost_per_month": "160.0"
    }, {
        "id": 60,
        "name": "32GB",
        "slug": null,
        "memory": 32768,
        "cpu": 12,
        "disk": 320,
        "cost_per_hour": 0.47619,
        "cost_per_month": "320.0"
    }, {
        "id": 70,
        "name": "48GB",
        "slug": null,
        "memory": 49152,
        "cpu": 16,
        "disk": 480,
        "cost_per_hour": 0.71429,
        "cost_per_month": "480.0"
    }, {
        "id": 69,
        "name": "64GB",
        "slug": null,
        "memory": 65536,
        "cpu": 20,
        "disk": 640,
        "cost_per_hour": 0.95238,
        "cost_per_month": "640.0"
    }, {
        "id": 68,
        "name": "96GB",
        "slug": null,
        "memory": 94208,
        "cpu": 24,
        "disk": 960,
        "cost_per_hour": 1.42857,
        "cost_per_month": "960.0"
    }];
    var chosensize = module.input("size");
    var size = null;
    sizes.forEach(function(e) {
        if (e.name == chosensize) {
            size = e.id;
        }
    });
    if (size) {
        var powerjson = {
            "client_id": module.input("client id"),
            "api_key": module.input("api key"),
            "droplet_id": module.input("droplet id"),
        };
        utils.notify("Powering droplet off. Resizing in one minute.");
        utils.api("digitalocean/power_off", powerjson);
        setTimeout(function() {
            utils.notify("Resizing to " + chosensize + ". Powering back on in one minute.");
            utils.api('digitalocean/resize', {
                "client_id": module.input("client id"),
                "api_key": module.input("api key"),
                "droplet_id": module.input("droplet id"),
                "drop_size_id": size
            });
        }, 60000);
        setTimeout(function() {
            utils.notify("Powering droplet on.");
            utils.api("digitalocean/power_on", powerjson);
        }, 120000);
    } else {
        utils.notify("ERROR: Invalid size for Digital Ocean resize.");
    }
});