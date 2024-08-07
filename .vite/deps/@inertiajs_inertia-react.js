import {
  require_lodash
} from "./chunk-IIS6UGZD.js";
import {
  require_dist
} from "./chunk-5CP6EYBT.js";
import "./chunk-Q4QOSTQZ.js";
import {
  require_react
} from "./chunk-32E4H3EV.js";
import {
  __commonJS
} from "./chunk-G3PMV62Z.js";

// node_modules/@inertiajs/inertia-react/dist/index.js
var require_dist2 = __commonJS({
  "node_modules/@inertiajs/inertia-react/dist/index.js"(exports) {
    function e(e2) {
      return e2 && "object" == typeof e2 && "default" in e2 ? e2.default : e2;
    }
    var n = e(require_lodash());
    var r = require_react();
    var t = e(r);
    var o = require_dist();
    function i() {
      return (i = Object.assign || function(e2) {
        for (var n2 = 1; n2 < arguments.length; n2++) {
          var r2 = arguments[n2];
          for (var t2 in r2) Object.prototype.hasOwnProperty.call(r2, t2) && (e2[t2] = r2[t2]);
        }
        return e2;
      }).apply(this, arguments);
    }
    function u(e2, n2) {
      var t2 = r.useState(function() {
        var r2 = o.Inertia.restore(n2);
        return void 0 !== r2 ? r2 : e2;
      }), i2 = t2[0], u2 = t2[1];
      return r.useEffect(function() {
        o.Inertia.remember(i2, n2);
      }, [i2, n2]), [i2, u2];
    }
    var a = r.createContext();
    a.displayName = "InertiaPageContext";
    var c = r.createContext();
    function s(e2) {
      var n2 = e2.children, t2 = e2.initialPage, u2 = e2.resolveComponent, s2 = e2.titleCallback, l2 = e2.onHeadUpdate, f2 = r.useState({ component: e2.initialComponent || null, page: t2, key: null }), p2 = f2[0], d2 = f2[1], v = r.useMemo(function() {
        return o.createHeadManager("undefined" == typeof window, s2 || function(e3) {
          return e3;
        }, l2 || function() {
        });
      }, []);
      if (r.useEffect(function() {
        o.Inertia.init({ initialPage: t2, resolveComponent: u2, swapComponent: function(e3) {
          var n3 = e3.component, r2 = e3.page, t3 = e3.preserveState;
          try {
            return d2(function(e4) {
              return { component: n3, page: r2, key: t3 ? e4.key : Date.now() };
            }), Promise.resolve();
          } catch (e4) {
            return Promise.reject(e4);
          }
        } });
      }, []), !p2.component) return r.createElement(c.Provider, { value: v }, r.createElement(a.Provider, { value: p2.page }, null));
      var m = n2 || function(e3) {
        var n3 = e3.Component, t3 = e3.props, o2 = r.createElement(n3, i({ key: e3.key }, t3));
        return "function" == typeof n3.layout ? n3.layout(o2) : Array.isArray(n3.layout) ? n3.layout.concat(o2).reverse().reduce(function(e4, n4) {
          return r.createElement(n4, i({ children: e4 }, t3));
        }) : o2;
      };
      return r.createElement(c.Provider, { value: v }, r.createElement(a.Provider, { value: p2.page }, m({ Component: p2.component, key: p2.key, props: p2.page.props })));
    }
    function l(e2) {
      var n2, o2, i2 = e2.children, u2 = e2.title, a2 = r.useContext(c), s2 = r.useMemo(function() {
        return a2.createProvider();
      }, [a2]);
      return r.useEffect(function() {
        return function() {
          s2.disconnect();
        };
      }, [s2]), s2.update((n2 = i2, o2 = (Array.isArray(n2) ? n2 : [n2]).filter(function(e3) {
        return e3;
      }).map(function(e3) {
        return function(e4) {
          return function e5(n3) {
            var r2 = function(e6) {
              var n4 = Object.keys(e6.props).reduce(function(n5, r3) {
                if (["head-key", "children", "dangerouslySetInnerHTML"].includes(r3)) return n5;
                var t2 = e6.props[r3];
                return "" === t2 ? n5 + " " + r3 : n5 + " " + r3 + '="' + t2 + '"';
              }, "");
              return "<" + e6.type + n4 + ">";
            }(n3);
            return n3.props.children && (r2 += function(n4) {
              return "string" == typeof n4.props.children ? n4.props.children : n4.props.children.reduce(function(n5, r3) {
                return n5 + e5(r3);
              }, "");
            }(n3)), n3.props.dangerouslySetInnerHTML && (r2 += n3.props.dangerouslySetInnerHTML.__html), function(e6) {
              return ["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"].indexOf(e6.type) > -1;
            }(n3) || (r2 += "</" + n3.type + ">"), r2;
          }(function(e5) {
            return t.cloneElement(e5, { inertia: void 0 !== e5.props["head-key"] ? e5.props["head-key"] : "" });
          }(e4));
        }(e3);
      }), u2 && !o2.find(function(e3) {
        return e3.startsWith("<title");
      }) && o2.push("<title inertia>" + u2 + "</title>"), o2)), null;
    }
    c.displayName = "InertiaHeadContext", s.displayName = "Inertia";
    var f = ["children", "as", "data", "href", "method", "preserveScroll", "preserveState", "replace", "only", "headers", "queryStringArrayFormat", "onClick", "onCancelToken", "onBefore", "onStart", "onProgress", "onFinish", "onCancel", "onSuccess", "onError"];
    var p = function() {
    };
    var d = r.forwardRef(function(e2, n2) {
      var t2 = e2.children, u2 = e2.as, a2 = void 0 === u2 ? "a" : u2, c2 = e2.data, s2 = void 0 === c2 ? {} : c2, l2 = e2.href, d2 = e2.method, v = void 0 === d2 ? "get" : d2, m = e2.preserveScroll, y = void 0 !== m && m, h = e2.preserveState, g = void 0 === h ? null : h, S = e2.replace, k = void 0 !== S && S, C = e2.only, b = void 0 === C ? [] : C, P = e2.headers, E = void 0 === P ? {} : P, x = e2.queryStringArrayFormat, w = void 0 === x ? "brackets" : x, I = e2.onClick, T = void 0 === I ? p : I, O = e2.onCancelToken, j = void 0 === O ? p : O, A = e2.onBefore, L = void 0 === A ? p : A, F = e2.onStart, H = void 0 === F ? p : F, R = e2.onProgress, B = void 0 === R ? p : R, D = e2.onFinish, q = void 0 === D ? p : D, M = e2.onCancel, N = void 0 === M ? p : M, U = e2.onSuccess, J = void 0 === U ? p : U, W = e2.onError, _ = void 0 === W ? p : W, Q = function(e3, n3) {
        if (null == e3) return {};
        var r2, t3, o2 = {}, i2 = Object.keys(e3);
        for (t3 = 0; t3 < i2.length; t3++) n3.indexOf(r2 = i2[t3]) >= 0 || (o2[r2] = e3[r2]);
        return o2;
      }(e2, f), z = r.useCallback(function(e3) {
        T(e3), o.shouldIntercept(e3) && (e3.preventDefault(), o.Inertia.visit(l2, { data: s2, method: v, preserveScroll: y, preserveState: null != g ? g : "get" !== v, replace: k, only: b, headers: E, onCancelToken: j, onBefore: L, onStart: H, onProgress: B, onFinish: q, onCancel: N, onSuccess: J, onError: _ }));
      }, [s2, l2, v, y, g, k, b, E, T, j, L, H, B, q, N, J, _]);
      a2 = a2.toLowerCase(), v = v.toLowerCase();
      var G = o.mergeDataIntoQueryString(v, l2 || "", s2, w);
      return l2 = G[0], s2 = G[1], "a" === a2 && "get" !== v && console.warn('Creating POST/PUT/PATCH/DELETE <a> links is discouraged as it causes "Open Link in New Tab/Window" accessibility issues.\n\nPlease specify a more appropriate element using the "as" attribute. For example:\n\n<Link href="' + l2 + '" method="' + v + '" as="button">...</Link>'), r.createElement(a2, i({}, Q, "a" === a2 ? { href: l2 } : {}, { ref: n2, onClick: z }), t2);
    });
    exports.App = s, exports.Head = l, exports.InertiaApp = s, exports.InertiaHead = l, exports.InertiaLink = d, exports.Link = d, exports.app = s, exports.createInertiaApp = function(e2) {
      try {
        var n2, t2, o2, i2, u2, a2, c2;
        t2 = void 0 === (n2 = e2.id) ? "app" : n2, o2 = e2.resolve, i2 = e2.setup, u2 = e2.title, a2 = e2.page, c2 = e2.render;
        var l2 = "undefined" == typeof window, f2 = l2 ? null : document.getElementById(t2), p2 = a2 || JSON.parse(f2.dataset.page), d2 = function(e3) {
          return Promise.resolve(o2(e3)).then(function(e4) {
            return e4.default || e4;
          });
        }, v = [];
        return Promise.resolve(d2(p2.component).then(function(e3) {
          return i2({ el: f2, App: s, props: { initialPage: p2, initialComponent: e3, resolveComponent: d2, titleCallback: u2, onHeadUpdate: l2 ? function(e4) {
            return v = e4;
          } : null } });
        })).then(function(e3) {
          return function() {
            if (l2) return Promise.resolve(c2(r.createElement("div", { id: t2, "data-page": JSON.stringify(p2) }, e3))).then(function(e4) {
              return { head: v, body: e4 };
            });
          }();
        });
      } catch (e3) {
        return Promise.reject(e3);
      }
    }, exports.link = d, exports.useForm = function() {
      var e2 = [].slice.call(arguments), t2 = r.useRef(null), a2 = "string" == typeof e2[0] ? e2[0] : null, c2 = r.useState(("string" == typeof e2[0] ? e2[1] : e2[0]) || {}), s2 = c2[0], l2 = c2[1], f2 = r.useRef(null), p2 = r.useRef(null), d2 = a2 ? u(s2, a2 + ":data") : r.useState(s2), v = d2[0], m = d2[1], y = a2 ? u({}, a2 + ":errors") : r.useState({}), h = y[0], g = y[1], S = r.useState(false), k = S[0], C = S[1], b = r.useState(false), P = b[0], E = b[1], x = r.useState(null), w = x[0], I = x[1], T = r.useState(false), O = T[0], j = T[1], A = r.useState(false), L = A[0], F = A[1], H = function(e3) {
        return e3;
      };
      r.useEffect(function() {
        return t2.current = true, function() {
          t2.current = false;
        };
      }, []);
      var R = r.useCallback(function(e3, n2, r2) {
        void 0 === r2 && (r2 = {});
        var u2 = i({}, r2, { onCancelToken: function(e4) {
          if (f2.current = e4, r2.onCancelToken) return r2.onCancelToken(e4);
        }, onBefore: function(e4) {
          if (j(false), F(false), clearTimeout(p2.current), r2.onBefore) return r2.onBefore(e4);
        }, onStart: function(e4) {
          if (E(true), r2.onStart) return r2.onStart(e4);
        }, onProgress: function(e4) {
          if (I(e4), r2.onProgress) return r2.onProgress(e4);
        }, onSuccess: function(e4) {
          if (t2.current && (E(false), I(null), g({}), C(false), j(true), F(true), p2.current = setTimeout(function() {
            t2.current && F(false);
          }, 2e3)), r2.onSuccess) return r2.onSuccess(e4);
        }, onError: function(e4) {
          if (t2.current && (E(false), I(null), g(e4), C(true)), r2.onError) return r2.onError(e4);
        }, onCancel: function() {
          if (t2.current && (E(false), I(null)), r2.onCancel) return r2.onCancel();
        }, onFinish: function() {
          if (t2.current && (E(false), I(null)), f2.current = null, r2.onFinish) return r2.onFinish();
        } });
        "delete" === e3 ? o.Inertia.delete(n2, i({}, u2, { data: H(v) })) : o.Inertia[e3](n2, H(v), u2);
      }, [v, g]);
      return { data: v, setData: function(e3, n2) {
        var r2;
        m("string" == typeof e3 ? i({}, v, ((r2 = {})[e3] = n2, r2)) : "function" == typeof e3 ? function(n3) {
          return e3(n3);
        } : e3);
      }, isDirty: !n(v, s2), errors: h, hasErrors: k, processing: P, progress: w, wasSuccessful: O, recentlySuccessful: L, transform: function(e3) {
        H = e3;
      }, setDefaults: function(e3, n2) {
        l2(void 0 === e3 ? function() {
          return v;
        } : function(r2) {
          var t3;
          return i({}, r2, n2 ? ((t3 = {})[e3] = n2, t3) : e3);
        });
      }, reset: function() {
        var e3 = [].slice.call(arguments);
        m(0 === e3.length ? s2 : Object.keys(s2).filter(function(n2) {
          return e3.includes(n2);
        }).reduce(function(e4, n2) {
          return e4[n2] = s2[n2], e4;
        }, i({}, v)));
      }, setError: function(e3, n2) {
        g(function(r2) {
          var t3, o2 = i({}, r2, n2 ? ((t3 = {})[e3] = n2, t3) : e3);
          return C(Object.keys(o2).length > 0), o2;
        });
      }, clearErrors: function() {
        var e3 = [].slice.call(arguments);
        g(function(n2) {
          var r2 = Object.keys(n2).reduce(function(r3, t3) {
            var o2;
            return i({}, r3, e3.length > 0 && !e3.includes(t3) ? ((o2 = {})[t3] = n2[t3], o2) : {});
          }, {});
          return C(Object.keys(r2).length > 0), r2;
        });
      }, submit: R, get: function(e3, n2) {
        R("get", e3, n2);
      }, post: function(e3, n2) {
        R("post", e3, n2);
      }, put: function(e3, n2) {
        R("put", e3, n2);
      }, patch: function(e3, n2) {
        R("patch", e3, n2);
      }, delete: function(e3, n2) {
        R("delete", e3, n2);
      }, cancel: function() {
        f2.current && f2.current.cancel();
      } };
    }, exports.usePage = function() {
      var e2 = r.useContext(a);
      if (!e2) throw new Error("usePage must be used within the Inertia component");
      return e2;
    }, exports.useRemember = u, exports.useRememberedState = function(e2, n2) {
      return console.warn('The "useRememberedState" hook has been deprecated and will be removed in a future release. Use "useRemember" instead.'), u(e2, n2);
    };
  }
});
export default require_dist2();
//# sourceMappingURL=@inertiajs_inertia-react.js.map
