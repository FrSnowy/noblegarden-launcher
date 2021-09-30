import React from 'react';
import ACTIONS from 'connector/actions';
import Dispatcher from 'connector/dispatcher';
import * as Elements from './elements';
import Header from 'front/features/Header';
import ContentBlock from 'front/features/ContentBlock';
import UpdateBlock from 'front/features/UpdateBlock';
import SettingsBlock from 'front/features/SettingsBlock';
import Preloader from '../shared/Preloader/index';
import ErrorBlock from '../ErrorBlock';

class Main extends React.Component {
  state = {
    loading: true,
    isVersionOK: false,
    isAccessGranted: false,
    notAccessibleFiles: false,
    canNotRenameFile: false,
    customPatches: [],
    settings: {
      downloadThreads: 1,
      watchedCustomPatches: [],
    },
  }

  componentDidMount() {
    Dispatcher.on(ACTIONS.CHECK_LAUNCHER_VERSION, (_, payload) => this.onLauncherVersionGet(payload));
    Dispatcher.on(ACTIONS.CHECK_LAUNCHER_FOLDER_ACCESS, (_, payload) => this.onLauncherFolderAccess(payload));
    Dispatcher.on(ACTIONS.DOWNLOAD_LIST_OF_FILES, (_, payload) => this.onDownloadListOfFiles(payload));
    Dispatcher.on(ACTIONS.GET_CUSTOM_PATCHES, (_, payload) => this.onGetCustomPatches(payload));
    Dispatcher.on(ACTIONS.GET_STORAGE, (_, payload) => this.onStorageGet(payload));
    Dispatcher.dispatch(ACTIONS.CHECK_LAUNCHER_VERSION);
    Dispatcher.dispatch(ACTIONS.GET_CUSTOM_PATCHES);
    Dispatcher.dispatch(ACTIONS.GET_STORAGE);
  }

  onGetCustomPatches = ({ action, result = [] }) => {
    action === 'finished' && this.setState({ customPatches: result });
  }

  onDownloadListOfFiles = ({ action, badFile = false }) => {
    action === 'error' && this.setState({ canNotRenameFile: badFile });
  }

  onStorageGet = ({ result }) => {
    if (!result) result = {};

    result = {
      downloadThreads: result.downloadThreads || 1,
      watchedCustomPatches: result.watchedCustomPatches || [],
    };

    this.setState({ settings: result });
  }

  changeDownloadThreads = threadsCount => {
    if (!threadsCount) return null;
    Dispatcher.dispatch(ACTIONS.SAVE_TO_STORAGE, { key: 'downloadThreads', value: threadsCount });

    this.setState({
      settings: {
        ...this.state.settings,
        downloadThreads: threadsCount,
      }
    });
  }

  resetCache = () => {
    Dispatcher.dispatch(ACTIONS.SAVE_TO_STORAGE, { key: 'downloadThreads', value: 1 });
    Dispatcher.dispatch(ACTIONS.SAVE_TO_STORAGE, { key: 'watchedCustomPatches', value: [] });
    Dispatcher.dispatch(ACTIONS.SAVE_TO_STORAGE, { key: 'rightModifiedDates', value: null });

    this.setState({
      settings: {
        ...this.state.settings,
        downloadThreads: 1,
        watchedCustomPatches: [],
      }
    });
  }

  watchPatch = patchName => {
    const watchedCustomPatches = [...new Set([...this.state.settings.watchedCustomPatches, patchName])];
    Dispatcher.dispatch(ACTIONS.SAVE_TO_STORAGE, { key: 'watchedCustomPatches', value: watchedCustomPatches });

    this.setState({
      settings: {
        ...this.state.settings,
        watchedCustomPatches,
      },
    });
  }

  unwatchPatch = patchName => {
    const watchedCustomPatches = this.state.settings.watchedCustomPatches.filter(name => name !== patchName);
    Dispatcher.dispatch(ACTIONS.SAVE_TO_STORAGE, { key: 'watchedCustomPatches', value: watchedCustomPatches });

    this.setState({
      settings: {
        ...this.state.settings,
        watchedCustomPatches,
      },
    });
  }

  onLauncherVersionGet = ({ action, result }) =>
    this.setState({ 
      loading: true,
      isVersionOK: result,
    }, () => {
      if (action !== 'finished') return;
      Dispatcher.dispatch(ACTIONS.CHECK_LAUNCHER_FOLDER_ACCESS);      
    });

  onLauncherFolderAccess = ({ action, result }) =>
    this.setState({
      loading: action === 'started',
      isAccessGranted: result,
    });
    
  onCheckUpdatingFilesAccessibility = ({ action, result = null }) => {
    action === 'finished' && result !== null && this.setState({
      notAccessibleFiles: result,
    });
  };

  errorType = () => {
    const { isVersionOK = false, isAccessGranted = false, notAccessibleFiles = false, canNotRenameFile = false } = this.state;    
    if (isVersionOK === 'not-working') return isVersionOK;
    if (!isVersionOK) return 'not-last-version';
    if (isAccessGranted !== null) return 'no-access';
    if (notAccessibleFiles !== false) return 'no-file-access';
    if (canNotRenameFile !== false) return 'can-not-rename-file';

    return null;
  }

  render() {
    const { loading = false, isAccessGranted = null, notAccessibleFiles = false, canNotRenameFile = false, customPatches, settings } = this.state;
    const errorType = this.errorType();

    return (
      <Elements.Container withImage = {!loading}>
        {
          loading
            ? <Preloader />
            : <>
                <Elements.Gradient />
                <Header />
                {
                  !errorType
                    ? <>
                        <ContentBlock />
                        <UpdateBlock settings = {settings} customPatches = {customPatches} />
                        <SettingsBlock
                          customPatches = {customPatches}
                          settings = {settings}
                          watchPatch = {this.watchPatch}
                          unwatchPatch = {this.unwatchPatch}
                          changeDownloadThreads = {this.changeDownloadThreads}
                          resetCache = {this.resetCache}
                        />
                      </>
                    : <ErrorBlock errorType = {errorType} msg = {isAccessGranted || notAccessibleFiles || canNotRenameFile}/>
                }
                <Elements.Version>v1.3.2</Elements.Version>
              </>
        }
      </Elements.Container>
    )
  }
};

export default Main;