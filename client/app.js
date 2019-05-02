$(document).ready(function() {
  var BingLayer = L.TileLayer.extend({
    // Bing Maps' Key
    // credentials: "AnTcaqBi2ypp0xI-OZNi4W_ik2KhjgpqioTAtXLC8GzkMBQRMlyxvxyTnd5b73im",
    // My own key
    // credentials: "AvrICdbWVmXh4YcxNMjCG8IQEljWmMPEIi_4yk60ednZql1rZuLFNrzpA1YzADE3",
    credentials:
      "AsXTYlvGm7gWw2wpW4N1woffDL_gpZaEvFnKRQcMFqsqhfFwHqWhaf5Py3qGsPIT",
    getTileUrl: function(tilePoint) {
      this._adjustTilePoint(tilePoint);
      return L.Util.template(this._url, {
        s: this._getSubdomain(tilePoint),
        q: this._quadKey(tilePoint.x, tilePoint.y, this._getZoomForUrl()),
        credentials: this.credentials
      });
    },
    _quadKey: function(x, y, z) {
      var quadKey = [];
      for (var i = z; i > 0; i--) {
        var digit = "0";
        var mask = 1 << (i - 1);
        if ((x & mask) != 0) {
          digit++;
        }
        if ((y & mask) != 0) {
          digit++;
          digit++;
        }
        quadKey.push(digit);
      }
      return quadKey.join("");
    }
  });

  // var LayerOS = new BingLayer('http://localhost:1337/ak.t{s}.tiles.virtualearth.net/tiles/r{q}.png?g=4510&productSet=mmOS&key={credentials}', {
  // var LayerOS = new BingLayer('http://localhost:1337/ak.dynamic.t{s}.tiles.virtualearth.net/comp/ch/{q}?mkt=en-GB&it=G,OS,BX,RL&shading=hill&n=z&og=110&key=Amp-JLUUMFtSIrdhUZllyEaonfEsFXQte82Ccu-NDPpQWXDmnjX8_PQY4GZGt0Fj&c4w=1', {
  var LayerOS = new BingLayer(
    "/cors/ak.dynamic.t{s}.tiles.virtualearth.net/comp/ch/{q}?mkt=en-GB&it=G,OS,BX,RL&shading=hill&n=z&og=107&key={credentials}&c4w=1",
    {
      subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
      attribution: '&copy; <a href="http://bing.com/maps">Bing Maps</a>',
      maxZoom: 16,
      detectRetina: true,
      useCache: true,
      cacheMaxAge: 4 * 7 * 24 * 60 * 60 * 1000
    }
  );

  var LayerOSM = L.tileLayer.provider("OpenStreetMap", {
    detectRetina: true,
    useCache: true,
    cacheMaxAge: 4 * 7 * 24 * 60 * 60 * 1000
  });
  var LayerOpenCycleMap = L.tileLayer.provider("Thunderforest.OpenCycleMap", {
    detectRetina: true,
    useCache: true,
    cacheMaxAge: 4 * 7 * 24 * 60 * 60 * 1000
  });
  var LayerOpenTopo = L.tileLayer.provider("OpenTopoMap", {
    detectRetina: true
  });
  var LayerEsriSat = L.tileLayer.provider("Esri.WorldImagery", {
    detectRetina: true,
    useCache: true,
    cacheMaxAge: 4 * 7 * 24 * 60 * 60 * 1000
  });

  var initPos = Cookies.get();

  var map = new L.Map(document.querySelector(".map"), {
    layers: [LayerOS],
    center: new L.LatLng(initPos.lat || 52.56155, initPos.lng || -1.8239),
    zoom: initPos.zoom || 10,
    scrollWheelZoom: true
  });

  var layers = {
    "OS Maps": LayerOS,
    "Open Street Maps": LayerOSM,
    "Open Cycle Maps": LayerOpenCycleMap,
    "Open Topo Maps": LayerOpenTopo,
    "Esri Satellite": LayerEsriSat
  };

  L.control.layers(layers).addTo(map);

  L.control.scale().addTo(map);

  // File Loader
  var style = {
    color: "#ff0000",
    opacity: 0.6,
    weight: 6,
    clickable: false
  };
  L.Control.FileLayerLoad.LABEL = '<i class="fa fa-folder-open"></i>';
  L.Control.fileLayerLoad({
    fitBounds: true,
    layerOptions: {
      style: style,
      pointToLayer: function(data, latlng) {
        return L.circleMarker(latlng, { style: style });
      }
    }
  })
    .addTo(map)
    .loader.on("data:loaded", function(e) {
      // Add to map layer switcher
      // layerswitcher.addOverlay(e.layer, e.filename);
      // console.log(e.layer.getBounds());
      // LayerOS.seed(e.layer.getBounds(), 12, 14);
    });

  $(window).unload(function() {
    Cookies.set("lat", map.getCenter().lat);
    Cookies.set("lng", map.getCenter().lng);
    Cookies.set("zoom", map.getZoom());
  });
});
