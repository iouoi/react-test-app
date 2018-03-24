
//-------------------------------------------------------------------------------
//
// 1. Max's script sets __REACT_DEVTOLLS_GLOBAL_HOOK__ globally.
//
//  <script type="text/javascript" src="./dev-tools-script.js"></script>
//
// window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {value: (hook : Hook)}

Object.defineProperty(window, '__REACT_DEVTOOLS_GLOBAL_HOOK__', {
    value: (hook : Hook),
  });

//...............................

	const hook = ({
    // Shared between Stack and Fiber:
    _renderers: {},
    helpers: {},
    checkDCE: function(fn) {...........},

    inject: function(renderer) {
      var id = Math.random().toString(16).slice(2);
      hook._renderers[id] = renderer;
      var reactBuildType = hasDetectedBadDCE ?
        'deadcode' :
        detectReactBuildType(renderer);
      hook.emit('renderer', {id, renderer, reactBuildType});
      return id;
    },
    _listeners: {},
    sub: function(evt, fn) {
      hook.on(evt, fn);
      return () => hook.off(evt, fn);
    },
    on: function(evt, fn) {
      if (!hook._listeners[evt]) {
        hook._listeners[evt] = [];
      }
      hook._listeners[evt].push(fn);
    },
    off: function(evt, fn) {
      if (!hook._listeners[evt]) {
        return;
      }
      var ix = hook._listeners[evt].indexOf(fn);
      if (ix !== -1) {
        hook._listeners[evt].splice(ix, 1);
      }
      if (!hook._listeners[evt].length) {
        hook._listeners[evt] = null;
      }
    },
    emit: function(evt, data) {
      if (hook._listeners[evt]) {
        hook._listeners[evt].map(fn => fn(data));
      }
    },
    // Fiber-only:
    supportsFiber: true,
    _fiberRoots: {},
    getFiberRoots(rendererID) {
      const roots = hook._fiberRoots;
      if (!roots[rendererID]) {
        roots[rendererID] = new Set();
      }
      return roots[rendererID];
    },
    onCommitFiberUnmount: function(rendererID, fiber) {
      // TODO: can we use hook for roots too?
      if (hook.helpers[rendererID]) {
        hook.helpers[rendererID].handleCommitFiberUnmount(fiber);
      }
    },
    onCommitFiberRoot: function(rendererID, root) {
      const mountedRoots = hook.getFiberRoots(rendererID);
      const current = root.current;
      const isKnownRoot = mountedRoots.has(root);
      const isUnmounting = current.memoizedState == null || current.memoizedState.element == null;
      // Keep track of mounted roots so we can hydrate when DevTools connect.
      if (!isKnownRoot && !isUnmounting) {
        mountedRoots.add(root);
      } else if (isKnownRoot && isUnmounting) {
        mountedRoots.delete(root);
      }
      if (hook.helpers[rendererID]) {
        hook.helpers[rendererID].handleCommitFiberRoot(root);
      }
    },
  });

//---------------------------------------------------------------------------------

//---------------------------------------------------------------------------------
//
//  2. React (if present) calls DOMRenderer.injectIntoDevTools() which
//     returns injectInternals() which 
//     calls __REACT_DEVTOLLS_GLOBAL_HOOK__.inject() with the internal renderer.
//
// react-dom.development.js
//
// starts by calling DOMRenderer.injectIntoDevTools() and assigns output to foundDevTools.
var foundDevTools = DOMRenderer.injectIntoDevTools({
  findFiberByHostInstance: getClosestInstanceFromNode,
  bundleType: 1,
  version: ReactVersion,
  rendererPackageName: 'react-dom'
});
    
//...............................................

//var _assign = require('object-assign');
injectIntoDevTools: function (devToolsConfig) {
      var findFiberByHostInstance = devToolsConfig.findFiberByHostInstance;

      return injectInternals(_assign({}, devToolsConfig, {
        findHostInstanceByFiber: function (fiber) {
          return findHostInstance(fiber);
        },
        findFiberByHostInstance: function (instance) {
          if (!findFiberByHostInstance) {
            // Might not be implemented by the renderer.
            return null;
          }
          return findFiberByHostInstance(instance);
        }
      }));
    }

//.................................................

function injectInternals(internals) {
  //..................
  var hook = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  // ..........................
  try {
    var rendererID = hook.inject(internals);
    // We have successfully injected, so now it is safe to set up hooks.
    //
    onCommitFiberRoot = catchErrors(function (root) {
      return hook.onCommitFiberRoot(rendererID, root);
    });
    onCommitFiberUnmount = catchErrors(function (fiber) {
      return hook.onCommitFiberUnmount(rendererID, fiber);
    });
  } catch (err) {
    //...................
  }
  // DevTools(Fiberline) exists
  return true;
}

//
//-----------------------------------------------------------------------------


//-----------------------------------------------------------------------------
//
// 3. Devtools(Fiberline) sees the renderer, and then adds this backend
// 

//react-devtools/backend/backend.js
import type {Hook} from './types';

var attachRenderer = require('./attachRenderer');

module.exports = function setupBackend(hook: Hook): boolean {
  var oldReact = window.React && window.React.__internals;
  if (oldReact && Object.keys(hook._renderers).length === 0) {
    hook.inject(oldReact);
  }

  for (var rid in hook._renderers) {
    hook.helpers[rid] = attachRenderer(hook, rid, hook._renderers[rid]);
    hook.emit('renderer-attached', {id: rid, renderer: hook._renderers[rid], helpers: hook.helpers[rid]});
  }

  hook.on('renderer', ({id, renderer}) => {
    hook.helpers[id] = attachRenderer(hook, id, renderer);
    hook.emit('renderer-attached', {id, renderer, helpers: hook.helpers[id]});
  });

  var shutdown = () => {
    for (var id in hook.helpers) {
      hook.helpers[id].cleanup();
    }
    hook.off('shutdown', shutdown);
  };
  hook.on('shutdown', shutdown);

  return true;
};

//...................................
// react-devtools/agent/inject.js
//
// setupBackend gets called here
import type {Hook} from '../backend/types';
import type Agent from './Agent';

var setupBackend = require('../backend/backend');

module.exports = function(hook: Hook, agent: Agent) {
  var subs = [
    hook.sub('renderer-attached', ({id, renderer, helpers}) => {
      agent.setReactInternals(id, helpers);
      helpers.walkTree(agent.onMounted.bind(agent, id), agent.addRoot.bind(agent, id));
    }),
    hook.sub('root', ({renderer, internalInstance}) => agent.addRoot(renderer, internalInstance)),
    hook.sub('mount', ({renderer, internalInstance, data}) => agent.onMounted(renderer, internalInstance, data)),
    hook.sub('update', ({renderer, internalInstance, data}) => agent.onUpdated(internalInstance, data)),
    hook.sub('unmount', ({renderer, internalInstance}) => agent.onUnmounted(internalInstance)),
  ];

  var success = setupBackend(hook);
  if (!success) {
    return;
  }

  hook.emit('react-devtools', agent);
  hook.reactDevtoolsAgent = agent;
  agent.on('shutdown', () => {
    subs.forEach(fn => fn());
    hook.reactDevtoolsAgent = null;
  });
};
/*
 * along with the Agent
 *    and whatever else is needed.
 * 4. The agent then calls `.emit('react-devtools', agent)`
 *
 * Now things are hooked up.
 *
 * When devtools closes, it calls `cleanup()` to remove the listeners
 * and any overhead caused by the backend.
 */
//-------------------------------------------------------------------------------------


