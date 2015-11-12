$(document).ready(function(){
  var BingLayer = L.TileLayer.extend({
    getTileUrl: function (tilePoint) {
      this._adjustTilePoint(tilePoint);
      return L.Util.template(this._url, {
        s: this._getSubdomain(tilePoint),
        q: this._quadKey(tilePoint.x, tilePoint.y, this._getZoomForUrl())
      });
    },
    _quadKey: function (x, y, z) {
      var quadKey = [];
      for (var i = z; i > 0; i--) {
        var digit = '0';
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
      return quadKey.join('');
    }
  });

  var LayerOS = new BingLayer('http://localhost:1337/ak.dynamic.t{s}.tiles.virtualearth.net/comp/ch/{q}?mkt=en-GB&it=G,OS,BX,RL&shading=hill&n=z&og=107&key=Ap0Nw80Jm3CbYCPvzZc6DPF9GTkbWQ-pGysYKbtLYEobQqeVODLRPmnFQOhzDkzq&c4w=1', {
      subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
      attribution: '&copy; <a href="http://bing.com/maps">Bing Maps</a>',
      maxZoom: 16,
      detectRetina: true,
      useCache: true
  });

  var LayerOSM = L.tileLayer.provider('OpenStreetMap', {
    detectRetina: true,
    useCache: true
  });
  var LayerOpenCycleMap = L.tileLayer.provider('Thunderforest.OpenCycleMap', {
    detectRetina: true,
    useCache: true
  });
  var LayerOpenTopo = L.tileLayer.provider('OpenTopoMap', {
    detectRetina: true
  });
  var LayerEsriSat = L.tileLayer.provider('Esri.WorldImagery', {
    detectRetina: true,
    useCache: true
  });


  var map = new L.Map(document.querySelector('.map'), {
    layers: [LayerOS],
    center: new L.LatLng(50.79601,-3.06939),
    zoom: 14
  });

  var layers = {
    "OS Maps": LayerOS,
    "Open Street Maps": LayerOSM,
    "Open Cycle Maps": LayerOpenCycleMap,
    "Open Topo Maps": LayerOpenTopo,
    "Esri Satellite": LayerEsriSat
  };

  L.control.layers(layers).addTo(map);
});
