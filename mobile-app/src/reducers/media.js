import { v4 as v4uuid } from 'uuid';

const uuid = v4uuid();

const initialState = {
  uuid,
  joined: false,
  live: false,
  device: null,
  transports: {
    producer: null,
    consumer: null,
  },
  changed: false,
  devices: {
    video: false,
    audio: false,
  },
  local: {
    video: null,
    audio: null,
    screen: null,
  },
  interfaces: [],
  settings: {
    facingMode: 'user',
    preview: true,
    video: {},
    audio: {},
    cover: {},
    hidden: {
      set: new Set(),
      control: false,
    },
    hasVideo: {},
    hasAudio: {},
    isMuted: {},
    ui: 'matrix',
    pinned: null,
    more: {
      matrix: 4,
      pinned: {
        desktop: 4,
        mobile: 2,
      },
    },
  },
  switching: false,
};

const reducer = (state = initialState, action) => {
  let interfaces = [...state.interfaces];
  let index = 0;
  let connection = {};
  const settings = {
    ...state.settings,
    video: {
      ...state.settings.video,
    },
    audio: {
      ...state.settings.audio,
    },
    cover: {
      ...state.settings.cover,
    },
    pinned: state.settings.pinned,
    hasVideo: {
      ...state.settings.hasVideo,
    },
    hasAudio: {
      ...state.settings.hasAudio,
    },
    isMuted: {
      ...state.settings.isMuted,
    },
  };
  switch (action.type) {
    case 'switching':
      return {
        ...state,
        switching: action.value,
      };
    case 'device-ready':
      return {
        ...state,
        device: action.device,
        devices: {
          video: action.video,
          audio: action.audio,
        },
      };
    case 'media-changed':
      return {
        ...state,
        changed: !state.changed,
      };
    case 'devices':
      return {
        ...state,
        devices: {
          video: action.video,
          audio: action.audio,
        },
      };
    case 'local-video':
      return {
        ...state,
        local: {
          ...state.local,
          video: action.data,
        },
      };
    case 'local-audio':
      return {
        ...state,
        local: {
          ...state.local,
          audio: action.data,
        },
      };
    case 'local-screen':
      return {
        ...state,
        local: {
          ...state.local,
          screen: action.data,
        },
      };
    case 'join':
      index = interfaces.findIndex((e) => e.uuid === state.uuid);
      interfaces[index] = {
        ...interfaces[index],
        name: action.name,
        email: action.email, // in consultease implementation remove name and email
      };
      return {
        ...state,
        joined: true,
        interfaces,
      };
    case 'live':
      return {
        ...state,
        live: true,
      };
    case 'leave':
      return {
        ...state,
        joined: false,
        live: false,
      };
    case 'facing-mode':
      if (settings.facingMode === 'user') {
        settings.facingMode = 'environment';
      } else {
        settings.facingMode = 'user';
      }
      return {
        ...state,
        settings,
      };
    case 'interfaces':
      for (const e of action.value) {
        settings.cover[e.uuid] = e.cover;
        settings.hasVideo[e.uuid] = !!e.video;
        settings.hasAudio[e.uuid] = !!e.audio;
        settings.more[e.uuid] = e.more;
      }
      settings.pinned = action.value.find((e) => e.id === e.pinned) ? settings.pinned : null;
      settings.ui = action.value.find((e) => e.id === e.pinned) ? settings.ui : 'matrix';
      return {
        ...state,
        interfaces: action.value,
        settings,
      };
    case 'interface-cover':
      return {
        ...state,
        settings: {
          ...state.settings,
          cover: {
            ...state.settings.cover,
            [action.uuid]: action.value,
          },
        },
      };
    case 'interface-hide':
      settings.hidden.set.add(action.value);
      return {
        ...state,
        settings: {
          ...state.settings,
          pinned: action.value === state.settings.pinned ? null : state.settings.pinned,
          ui: action.value === state.settings.pinned ? 'matrix' : state.settings.ui,
          hidden: {
            ...settings.hidden,
            control: !settings.hidden.control,
          },
        },
      };
    case 'interface-show':
      settings.hidden.set.delete(action.value);
      return {
        ...state,
        settings: {
          ...state.settings,
          hidden: {
            ...settings.hidden,
            control: !settings.hidden.control,
          },
        },
      };
    case 'switch-ui':
      return {
        ...state,
        settings: {
          ...state.settings,
          ui: action.value,
          pinned: action.pin,
        },
      };
    case 'preview':
      return {
        ...state,
        settings: {
          ...state.settings,
          preview: !state.settings.preview,
        },
      };
    case 'ui-matrix-peers':
      return {
        ...state,
        settings: {
          ...state.settings,
          more: {
            ...state.settings.more,
            matrix: action.value,
          },
        },
      };
    case 'ui-pinned-desktop-peers':
      return {
        ...state,
        settings: {
          ...state.settings,
          more: {
            ...state.settings.more,
            pinned: {
              ...state.settings.more.pinned,
              desktop: action.value,
            },
          },
        },
      };
    case 'ui-pinned-mobile-peers':
      return {
        ...state,
        settings: {
          ...state.settings,
          more: {
            ...state.settings.more,
            pinned: {
              ...state.settings.more.pinned,
              mobile: action.value,
            },
          },
        },
      };
    case 'transports':
      return {
        ...state,
        transports: {
          producer: action.data.producerTransport,
          consumer: action.data.consumerTransport,
        },
      };
    case 'new-producer':
      index = interfaces.findIndex((e) => e.uuid === action.producer.uuid);
      connection = {
        producer: action.producer,
        consumer: action.consumer,
        stream: action.stream,
      };
      if (action.producer.kind === 'video') {
        settings.cover[action.producer.uuid] = true;
        settings.hasVideo[action.producer.uuid] = true;
      } else if (action.producer.kind === 'audio') {
        settings.hasAudio[action.producer.uuid] = true;
      }
      if (action.producer.kind === 'screen') {
        interfaces.push({
          uuid: action.producer.uuid,
          video: connection,
          name: `${action.producer.name} (screen)`,
          email: action.producer.email,
          screen: true,
          id: `${action.producer.uuid}-screen`,
          facingMode: action.producer.facingMode,
        });
      } else if (index === -1) {
        interfaces.push({
          uuid: action.producer.uuid,
          [action.producer.kind]: connection,
          name: action.producer.name,
          email: action.producer.email,
          id: action.producer.uuid,
          facingMode: action.producer.facingMode,
        });
      } else {
        interfaces[index] = {
          ...interfaces[index],
          [action.producer.kind]: connection,
          id: action.producer.uuid,
          facingMode: action.producer.facingMode,
        };
      }
      settings.ui = action.producer.kind === 'screen' ? 'pinned' : state.settings.ui;
      settings.pinned =
        action.producer.kind === 'screen'
          ? `${action.producer.uuid}-screen`
          : state.settings.pinned;
      return {
        ...state,
        interfaces,
        settings,
      };
    case 'producer-close':
      index = interfaces.findIndex((e) => {
        return e.uuid === action.uuid && (action.kind === 'screen' ? e.screen : !e.screen);
      });
      if (index === -1) {
        return state;
      }
      if (action.kind === 'screen') {
        if (state.settings.pinned === `${action.uuid}-screen`) {
          settings.ui = 'matrix';
          settings.pinned = null;
        }
        interfaces.splice(index, 1);
      } else {
        interfaces[index][action.kind] = null;
        if (action.kind === 'video') {
          settings.hasVideo[action.uuid] = false;
        } else if (action.kind === 'audio') {
          settings.hasAudio[action.uuid] = false;
        }
      }
      return {
        ...state,
        interfaces,
        settings,
      };
    case 'peers':
      interfaces = [];
      state.interfaces.forEach((peer) => {
        if (action.peers[peer.uuid]) {
          interfaces.push(peer);
        }
      });
      Object.keys(action.peers).forEach((key) => {
        index = interfaces.findIndex((e) => e.uuid === key);
        if (index === -1) {
          interfaces.push({
            uuid: key,
            name: action.peers[key].name,
            email: action.peers[key].email,
            id: key,
          });
        } else {
          interfaces[index] = {
            ...interfaces[index],
            ...action.peers[key],
            id: key,
          };
        }
      });
      return {
        ...state,
        interfaces,
      };
    default:
      return state;
  }
};

export default reducer;
