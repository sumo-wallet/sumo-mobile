export function showDappWarningAlert() {
  return {
    type: 'SHOW_WARNING_ALERT',
  };
}

export function addFavoriteDApp(dapp) {
  return {
    type: 'ADD_FAVORITE_DAPP',
    dapp,
  };
}

export function removeFavoriteDApp(dapp) {
  return {
    type: 'REMOVE_FAVORITE_DAPP',
    dapp,
  };
}
