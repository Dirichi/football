function storeSid(sidPayload: {id: string}) {
  localStorage.setItem('localFootbalSid', sidPayload);
}

storeSid(sidPayload);
