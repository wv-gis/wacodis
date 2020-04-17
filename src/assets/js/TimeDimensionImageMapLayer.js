import * as L from 'leaflet';
import * as esri from 'esri-leaflet';

L.TimeDimension.Layer.ImageMapLayer = L.TimeDimension.Layer.extend({

    initialize: function(layer, options) {
        L.TimeDimension.Layer.prototype.initialize.call(this, layer, options);
        this._layers = {};
        this._defaultTime = 0;
        this._timeCacheBackward = this.options.cacheBackward || this.options.cache || 0;
        this._timeCacheForward = this.options.cacheForward || this.options.cache || 0;
        this._updateTimeDimension = this.options.updateTimeDimension || false;
        this._setDefaultTime = this.options.setDefaultTime || false;
        this._updateTimeDimensionMode = this.options.updateTimeDimensionMode || 'intersect'; // 'union' or 'replace'
        this._period = this.options.period || null;
        this._availableTimes = [];

        this._baseLayer.on('load', (function() {
            this._baseLayer.setLoaded(true);
            this.fire('timeload', {
                time: this._defaultTime
            });
        }).bind(this));
    },

    eachLayer: function(method, context) {
        for (var prop in this._layers) {
            if (this._layers.hasOwnProperty(prop)) {
                method.call(context, this._layers[prop]);
            }
        }
        return L.TimeDimension.Layer.prototype.eachLayer.call(this, method, context);
    },

    _onNewTimeLoading: function(ev) {
        var layer = this._getLayerForTime(ev.time);
        if (!this._map.hasLayer(layer)) {
            this._map.addLayer(layer);
        }
    },

    isReady: function(time) {
        var layer = this._getLayerForTime(time);
        return layer.isLoaded();
    },

    _update: function() {
        if (!this._map)
            return;
        var time = map.timeDimension.getCurrentTime();
        var layer = this._getLayerForTime(time);
        if (this._currentLayer == null) {
            this._currentLayer = layer;
        }
        if (!this._map.hasLayer(layer)) {
            this._map.addLayer(layer);
        } else {
            this._showLayer(layer, time);
        }
    },

    _showLayer: function(layer, time) {
        if (this._currentLayer && this._currentLayer !== layer) {
            this._currentLayer.hide();
            this._map.removeLayer(this._currentLayer);
        }
        layer.show();
        if (this._currentLayer && this._currentLayer === layer) {
            return;
        }
        this._currentLayer = layer;
        // Cache management
        var times = this._getLoadedTimes();
        var strTime = String(time);
        var index = times.indexOf(strTime);
        var remove = [];
        // remove times before current time
        if (this._timeCacheBackward > -1) {
            var objectsToRemove = index - this._timeCacheBackward;
            if (objectsToRemove > 0) {
                remove = times.splice(0, objectsToRemove);
                this._removeLayers(remove);
            }
        }
        if (this._timeCacheForward > -1) {
            index = times.indexOf(strTime);
            var objectsToRemove = times.length - index - this._timeCacheForward - 1;
            if (objectsToRemove > 0) {
                remove = times.splice(index + this._timeCacheForward + 1, objectsToRemove);
                this._removeLayers(remove);
            }
        }
    },

    _getLayerForTime: function(time) {
        if (time == 0 || time == this._defaultTime) {
            return this._baseLayer;
        }
        if (this._layers.hasOwnProperty(time)) {
            return this._layers[time];
        }
        var url = this._getUrlFunction(this._baseLayer.getURL(), time);
        imageBounds = this._baseLayer._bounds;

        var newLayer = esri.imageMapLayer(this._baseLayer.options); // hier
        this._layers[time] = newLayer;
        newLayer.on('load', (function(layer, time) {
            layer.setLoaded(true);
            if (map.timeDimension && time == map.timeDimension.getCurrentTime() && !map.timeDimension.isLoading()) {
                this._showLayer(layer, time);
            }
            this.fire('timeload', {
                time: time
            });
        }).bind(this, newLayer, time));

        // Hack to hide the layer when added to the map.
        // It will be shown when timeload event is fired from the map (after all layers are loaded)
        newLayer.onAdd = (function(map) {
            Object.getPrototypeOf(this).onAdd.call(this, map);
            this.hide();
        }).bind(newLayer);
        return newLayer;
    },
    setAvailableTimes: function(times) {
        this._availableTimes = L.TimeDimension.Util.parseTimesExpression(times, this._period);
        this._updateTimeDimensionAvailableTimes();
    },

    _updateTimeDimensionAvailableTimes: function() {
        if ((this._timeDimension && this._updateTimeDimension) ||
            (this._timeDimension && this._timeDimension.getAvailableTimes().length == 0)) {
            this._timeDimension.setAvailableTimes(this._availableTimes, this._updateTimeDimensionMode);
            if (this._setDefaultTime && this._defaultTime > 0) {
                this._timeDimension.setCurrentTime(this._defaultTime);
            }
        }
    },
    _getLoadedTimes: function() {
        var result = [];
        for (var prop in this._layers) {
            if (this._layers.hasOwnProperty(prop)) {
                result.push(prop);
            }
        }
        return result.sort();
    },

    _removeLayers: function(times) {
        for (var i = 0, l = times.length; i < l; i++) {
            this._map.removeLayer(this._layers[times[i]]);
            delete this._layers[times[i]];
        }
    },

});

L.timeDimension.layer.imageMapLayer = function(layer, options) {
    return new L.TimeDimension.Layer.ImageMapLayer(layer, options);
};

L.esri.ImageMapLayer.include({
    _visible: true,
    _loaded: false,

    _originalUpdate: esri.imageMapLayer.prototype._update,

    _update: function() {
        if (!this._visible && this._loaded) {
            return;
        }
        this._originalUpdate();
    },

    setLoaded: function(loaded) {
        this._loaded = loaded;
    },

    isLoaded: function() {
        return this._loaded;
    },

    hide: function() {
        this._visible = false;
        if (this._image && this._image.style)
            this._image.style.display = 'none';
    },

    show: function() {
        this._visible = true;
        if (this._image && this._image.style)
            this._image.style.display = 'block';
    },

    getURL: function() {
        return this._url;
    },

});