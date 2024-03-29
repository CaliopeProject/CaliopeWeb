// Usage:
// Put this in a separate file and load it as the first module
// (See https://github.com/jrburke/requirejs/wiki/Internal-API:-onResourceLoad)
// Methods available after page load:
// rtree.map()
// - Fills out every module's map property under rtree.tree.
// - Print out rtree.tree in the console to see their map property.
// rtree.toUml()
// - Prints out a UML string that can be used to generate UML
// - UML Website: http://yuml.me/diagram/scruffy/class/draw
requirejs.onResourceLoad = function (context, map, depMaps) {
    if (!window.rtree) {
        window.rtree = {
            tree: {},
            map: function() {
                var key;
                for (key in this.tree) {
                    if (this.tree.hasOwnProperty(key)) {
                        var val = this.tree[key];
                        var i;
                        for ( i = 0; i < val.deps.length; ++i) {
                            var dep = val.deps[i];
                            val.map[dep] = this.tree[dep];
                        }
                    }
                }
            },
            toUml: function() {
                var uml = [];
                var key;
                for (key in this.tree) {
                    if (this.tree.hasOwnProperty(key)) {
                        var val = this.tree[key];
                        for (i = 0; i < val.deps.length; ++i) {
                            uml.push("[" + key + "]->[" + val.deps[i] + "]");
                        }
                    }
                }

                return uml.join("\n");
            }
        };
    }

    var tree = window.rtree.tree;

    function Node() {
        this.deps = [];
        this.map = {};
    }

    if (!tree[map.name]) {
        tree[map.name] = new Node();
    }

    // For a full dependency tree
    if (depMaps) {
        var i;
        for (i = 0; i < depMaps.length; ++i) {
            tree[map.name].deps.push(depMaps[i].name);
        }
    }
};
