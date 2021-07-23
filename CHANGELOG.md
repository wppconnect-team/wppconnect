## 1.8.6 (2021-07-23)



## [1.8.5](https://github.com/wppconnect-team/wppconnect/compare/v1.8.4...v1.8.5) (2021-07-20)



## 1.8.4 (2021-07-20)


### Bug Fixes

* Corrigido o envio de arquivos de tipos de áudio via URL (fix [#329](https://github.com/wppconnect-team/wppconnect/issues/329)) ([6e8b836](https://github.com/wppconnect-team/wppconnect/commit/6e8b836f40ecda9df4870b09d6fc11410a15e1f6))



## 1.8.3 (2021-07-14)


### Bug Fixes

* Corrigido disparos de onNotificationMessage e onParticipantsChanged ao iniciar ([d421f7b](https://github.com/wppconnect-team/wppconnect/commit/d421f7bc860ec4cee503340c14e676692094ac1d))



## 1.8.2 (2021-07-14)


### Features

* Adicionado recurso de recusar ligação do WhatsApp (close [#299](https://github.com/wppconnect-team/wppconnect/issues/299)) ([e7ef0b6](https://github.com/wppconnect-team/wppconnect/commit/e7ef0b6db0aecf57bd058c681127a0bdd756636b))



## [1.8.1](https://github.com/wppconnect-team/wppconnect/compare/v1.8.0...v1.8.1) (2021-07-12)

### Bug Fixes

- Atualizado a versão estável do WhatsApp ([08dabb2](https://github.com/wppconnect-team/wppconnect/commit/08dabb21f3b4d00175efc7d260a257a805fe4716))

# [1.8.0](https://github.com/wppconnect-team/wppconnect/compare/v1.7.5...v1.8.0) (2021-07-12)

### Features

- Estabilidade para evitar problemas na atualização do WhatsApp ([97d26ab](https://github.com/wppconnect-team/wppconnect/commit/97d26ab7b3c18ba699f4888d0b109a5b8bd9d3d7))

## [1.7.5](https://github.com/wppconnect-team/wppconnect/compare/v1.7.4...v1.7.5) (2021-07-09)

### Bug Fixes

- Corrigido injeção de script para nova versão do WhatsApp Web ([efd6fe7](https://github.com/wppconnect-team/wppconnect/commit/efd6fe76ffdd4b2ae3e287736a4bf3dd8315e23e))

## [1.7.4](https://github.com/wppconnect-team/wppconnect/compare/v1.7.3...v1.7.4) (2021-07-08)

### Bug Fixes

- Corrigido o disparo do evento onAddedToGroup ([9e0fcbe](https://github.com/wppconnect-team/wppconnect/commit/9e0fcbe6f022e4acbb047cfbd814c9012a293722))

## [1.7.3](https://github.com/wppconnect-team/wppconnect/compare/v1.7.2...v1.7.3) (2021-07-02)

### Bug Fixes

- Corrigido função onAddedToGroup (fix [#276](https://github.com/wppconnect-team/wppconnect/issues/276)) ([f034d1a](https://github.com/wppconnect-team/wppconnect/commit/f034d1ad69f43634da8d9924f7c968cd5fdcbe18))
- Envolvido todos erros para separar erro da LIB do puppeteer ([68b933d](https://github.com/wppconnect-team/wppconnect/commit/68b933d8816ba3a2d0a0a34acdbbed2155d7dcf9))

### Performance Improvements

- Removido chat da serialização de mensagem para maior desempenho ([#289](https://github.com/wppconnect-team/wppconnect/issues/289)) ([69df15c](https://github.com/wppconnect-team/wppconnect/commit/69df15cc39406ee4e9e3d5e1e35b8764d4247d73))
- Removido o quotedMsgObj da serialização de mensagem e adicionado quotedMsgId ([#289](https://github.com/wppconnect-team/wppconnect/issues/289)) ([3f6daaf](https://github.com/wppconnect-team/wppconnect/commit/3f6daaf6235e6f3e4de8d417aafdfc5091fa170c))

## [1.7.2](https://github.com/wppconnect-team/wppconnect/compare/v1.7.1...v1.7.2) (2021-07-01)

### Features

- Adicionado nova função getMessages (fix [#282](https://github.com/wppconnect-team/wppconnect/issues/282)) ([ee783e4](https://github.com/wppconnect-team/wppconnect/commit/ee783e423292665c355f5232ccec8b363a872dd3))

## [1.7.1](https://github.com/wppconnect-team/wppconnect/compare/v1.7.0...v1.7.1) (2021-06-22)

### Bug Fixes

- Corrigido a função sendLocation (fix [#273](https://github.com/wppconnect-team/wppconnect/issues/273)) ([e3dd987](https://github.com/wppconnect-team/wppconnect/commit/e3dd987c4a5dd4412d50f7b86d67577384878e06))

# [1.7.0](https://github.com/wppconnect-team/wppconnect/compare/v1.6.0...v1.7.0) (2021-06-21)

### Bug Fixes

- Corrigido a função getProfilePicFromServer ([#240](https://github.com/wppconnect-team/wppconnect/issues/240)) ([b7061e5](https://github.com/wppconnect-team/wppconnect/commit/b7061e5da570ba146dd18695a9de7e62858d70bc))
- Corrigido e melhorado a função de onLiveLocation (fix [#258](https://github.com/wppconnect-team/wppconnect/issues/258)) ([6bc6d7e](https://github.com/wppconnect-team/wppconnect/commit/6bc6d7e706eb2a6a30e8f24a81e466f35a2c2c10))

### Features

- new functions catalog business ([#255](https://github.com/wppconnect-team/wppconnect/issues/255)) ([96d391e](https://github.com/wppconnect-team/wppconnect/commit/96d391e90dfea9e5dee8cd72d6d04e6d842c5ea2))

# [1.6.0](https://github.com/wppconnect-team/wppconnect/compare/v1.5.2...v1.6.0) (2021-06-02)

### Bug Fixes

- Fixed send message to non contact ([c66b597](https://github.com/wppconnect-team/wppconnect/commit/c66b597f80ed8d08c0c07ba0ca9252f6f328372e))

## [1.5.2](https://github.com/wppconnect-team/wppconnect/compare/v1.5.1...v1.5.2) (2021-05-24)

### Bug Fixes

- Fixed click to reload qr code, Update scrape-img-qr.ts ([a2104e4](https://github.com/wppconnect-team/wppconnect/commit/a2104e4b5bb50a606c90a2d7d42801289f33f2c1)) Thanks to @AlanMartines

## [1.5.1](https://github.com/wppconnect-team/wppconnect/compare/v1.5.0...v1.5.1) (2021-05-21)

### Bug Fixes

- Fixed getGroupInviteLink function (fix [#214](https://github.com/wppconnect-team/wppconnect/issues/214)) ([597715b](https://github.com/wppconnect-team/wppconnect/commit/597715bc2984c2e4e56942830f893e52d61f9091))

### Features

- Added revokeGroupInviteLink function; ([50feb3c](https://github.com/wppconnect-team/wppconnect/commit/50feb3ceeaa1ed5a0648158f85a11853931725cb))

# [1.5.0](https://github.com/wppconnect-team/wppconnect/compare/v1.4.1...v1.5.0) (2021-05-18)

### Bug Fixes

- Fixed sendFile return type ([#208](https://github.com/wppconnect-team/wppconnect/issues/208)) ([67dfad5](https://github.com/wppconnect-team/wppconnect/commit/67dfad5c54c598791dc0ac3a0947d5c339fffe2c))
- Fixed sendPtt return type (fix [#208](https://github.com/wppconnect-team/wppconnect/issues/208)) ([5b701f7](https://github.com/wppconnect-team/wppconnect/commit/5b701f7834134e51d92cff9a86665bf1bce3abf6))
- Fixed setChatState function (fix [#188](https://github.com/wppconnect-team/wppconnect/issues/188)) ([3351bf7](https://github.com/wppconnect-team/wppconnect/commit/3351bf797b49732efccc4306aca04f4899e3a32c))

### Features

- Added onPresenceChanged to listen presence change ([4629699](https://github.com/wppconnect-team/wppconnect/commit/46296992602ea12631821d1345e5c6c32a5efd3d))
- Added starMessage function to star/unstar messages ([b83fcbb](https://github.com/wppconnect-team/wppconnect/commit/b83fcbb6ec67578dcddb936ecb2bee079f5cdd46))

## [1.4.1](https://github.com/wppconnect-team/wppconnect/compare/v1.4.0...v1.4.1) (2021-05-14)

### Bug Fixes

- Fixed archiveChat function ([#194](https://github.com/wppconnect-team/wppconnect/issues/194)) ([1ee2bce](https://github.com/wppconnect-team/wppconnect/commit/1ee2bce38841fc4d123c08fc8395639bfada1c41))
- Fixed clearChat function ([#194](https://github.com/wppconnect-team/wppconnect/issues/194)) ([4ee7a2e](https://github.com/wppconnect-team/wppconnect/commit/4ee7a2ec0c3bb58aab9ae4df4dc0a0c4f682617a))
- Fixed return of forwardMessages function ([#194](https://github.com/wppconnect-team/wppconnect/issues/194)) ([d81f94b](https://github.com/wppconnect-team/wppconnect/commit/d81f94bc195a559222a07340ab1c1209c6251558))

# [1.4.0](https://github.com/wppconnect-team/wppconnect/compare/v1.3.6...v1.4.0) (2021-05-08)

### Bug Fixes

- Fixed getAllMessagesInChat function when chat not found ([2760f68](https://github.com/wppconnect-team/wppconnect/commit/2760f68e2347f4ec9b664315c4a1a89371760aab))
- Fixed onParticipantsChanged function (fix [#171](https://github.com/wppconnect-team/wppconnect/issues/171)) ([08975a0](https://github.com/wppconnect-team/wppconnect/commit/08975a0657eaed1e4dfc1673003ffac9c657c87f))
- Improved speed of loadAndGetAllMessagesInChat function (fix [#166](https://github.com/wppconnect-team/wppconnect/issues/166)) ([7f1348a](https://github.com/wppconnect-team/wppconnect/commit/7f1348ac75756822c9356ecc2fc8d793a84f0e30))

### Features

- Added getAllBroadcastList function (close [#184](https://github.com/wppconnect-team/wppconnect/issues/184)) ([351be03](https://github.com/wppconnect-team/wppconnect/commit/351be03ba4801566753e8856ee3940fb362e202e))
- Added onNotificationMessage function for notif. msg. ([#171](https://github.com/wppconnect-team/wppconnect/issues/171)) ([32c395b](https://github.com/wppconnect-team/wppconnect/commit/32c395b2f936b9b9d259ca43acaa44c02d455bb6))

## [1.3.6](https://github.com/wppconnect-team/wppconnect/compare/v1.3.5...v1.3.6) (2021-05-04)

### Bug Fixes

- Fixed getAllUnreadMessages and getAllNewMessages (fix [#170](https://github.com/wppconnect-team/wppconnect/issues/170)) ([c45314f](https://github.com/wppconnect-team/wppconnect/commit/c45314f25112a93b242ebd5985e5c69aa8008166))

## [1.3.5](https://github.com/wppconnect-team/wppconnect/compare/v1.3.3...v1.3.5) (2021-05-03)

### Bug Fixes

- Fixed deletion of tmp chrome user data dir on exit ([8586505](https://github.com/wppconnect-team/wppconnect/commit/85865059810ba9388f172c2ff3b681bae6a3b420))
- Fixed sendVideoAsGif from URL ([0422a5b](https://github.com/wppconnect-team/wppconnect/commit/0422a5bf7ba94c8d5255592fbc6b5a959ca8ba7d))

### Features

- Added sendGif method to send GIF in the chat ([#112](https://github.com/wppconnect-team/wppconnect/issues/112)) ([4ee590c](https://github.com/wppconnect-team/wppconnect/commit/4ee590c1d0c07bec7d5789deb60f693e0a524192))

## [1.3.4](https://github.com/wppconnect-team/wppconnect/compare/v1.3.3...v1.3.4) (2021-04-30)

### Bug Fixes

- Fixed deletion of tmp chrome user data dir on exit ([8586505](https://github.com/wppconnect-team/wppconnect/commit/85865059810ba9388f172c2ff3b681bae6a3b420))

## [1.3.3](https://github.com/wppconnect-team/wppconnect/compare/v1.3.2...v1.3.3) (2021-04-28)

## [1.3.2](https://github.com/wppconnect-team/wppconnect/compare/v1.3.1...v1.3.2) (2021-04-28)

### Bug Fixes

- Fixed message ID generator ([0da9a62](https://github.com/wppconnect-team/wppconnect/commit/0da9a62490073642aa00dc4f7052465de271f7f3))
- Fixed sendContact with custom name ([#152](https://github.com/wppconnect-team/wppconnect/issues/152)) ([47a51f0](https://github.com/wppconnect-team/wppconnect/commit/47a51f060814ab79704b160227c350092e2abe3f))

### Features

- Allow to define contact name in sendContactVcardList ([#152](https://github.com/wppconnect-team/wppconnect/issues/152)) ([474e5a0](https://github.com/wppconnect-team/wppconnect/commit/474e5a061496cd96ca4864b0d033813bc47c573a))

## [1.3.1](https://github.com/wppconnect-team/wppconnect/compare/v1.3.0...v1.3.1) (2021-04-20)

### Features

- Added function to enable and disable temporary messages ([5a9a289](https://github.com/wppconnect-team/wppconnect/commit/5a9a2891785e6b34e3bcb6a6cee3502101e36d7f))
- Added options to edit group description, subject and properties ([07d155f](https://github.com/wppconnect-team/wppconnect/commit/07d155fb5ca891223881100b28931c4fbbf37740))

# [1.3.0](https://github.com/wppconnect-team/wppconnect/compare/v1.2.6...v1.3.0) (2021-04-16)

### Bug Fixes

- corrects update instructions ([#124](https://github.com/wppconnect-team/wppconnect/issues/124)) ([8cbfb9b](https://github.com/wppconnect-team/wppconnect/commit/8cbfb9b2c48879d5c6709a40eb7e53188a1347f2))

### Features

- Created tokenStore interface for session data management ([a3a76c3](https://github.com/wppconnect-team/wppconnect/commit/a3a76c3e2e01581ff2ae4e40199eab5957bac0a3))

## [1.2.6](https://github.com/wppconnect-team/wppconnect/compare/v1.2.5...v1.2.6) (2021-04-12)

### Bug Fixes

- Fixed sendFile from URL ([ff63fed](https://github.com/wppconnect-team/wppconnect/commit/ff63fedd51793896169cc09097e13d99290ec031))

## [1.2.5](https://github.com/wppconnect-team/wppconnect/compare/v1.2.4...v1.2.5) (2021-04-07)

### Bug Fixes

- Fixed event dispose to stop listeners ([#103](https://github.com/wppconnect-team/wppconnect/issues/103)) ([0682c06](https://github.com/wppconnect-team/wppconnect/commit/0682c06122dc534789cea5721a515e4bdd96e4de))

### Features

- Added phoneWatchdog verification ([6616fa2](https://github.com/wppconnect-team/wppconnect/commit/6616fa22567fe0ea1f35fff32ec1f8b070e76695))

## [1.2.4](https://github.com/wppconnect-team/wppconnect/compare/v1.2.3...v1.2.4) (2021-03-30)

### Bug Fixes

- Fixed inject token for authentication ([c36466f](https://github.com/wppconnect-team/wppconnect/commit/c36466faddda75dcbfcc7f1e18d275917e41e707))

## [1.2.3](https://github.com/wppconnect-team/wppconnect/compare/v1.2.2...v1.2.3) (2021-03-29)

### Bug Fixes

- Fixed downloadMedia with new WhatsApp version (fix [#76](https://github.com/wppconnect-team/wppconnect/issues/76)) ([f61e118](https://github.com/wppconnect-team/wppconnect/commit/f61e1183937e8dd2989d892b6a8e7b8e117cd22e))

## [1.2.2](https://github.com/wppconnect-team/wppconnect/compare/v1.2.1...v1.2.2) (2021-03-29)

### Bug Fixes

- Fixed logged token delete on disconnect ([883d0d4](https://github.com/wppconnect-team/wppconnect/commit/883d0d415a6dd7d05625adcefaa0d3d397fc11ed))
- Fixed statusFind callback (#fix 57) ([cc0d3d6](https://github.com/wppconnect-team/wppconnect/commit/cc0d3d69855ae219699ea65a53e63379f72e3aa6))

## [1.2.1](https://github.com/wppconnect-team/wppconnect/compare/v1.2.0...v1.2.1) (2021-03-04)

### Bug Fixes

- Fixed send to status@broadcast ([a0c8d20](https://github.com/wppconnect-team/wppconnect/commit/a0c8d2053d15851dbde34b3a4f3ce03481f8ea09))

# [1.2.0](https://github.com/wppconnect-team/wppconnect/compare/v1.1.0...v1.2.0) (2021-03-02)

### Bug Fixes

- Increased timeout WhatsApp page load ([c1f8f03](https://github.com/wppconnect-team/wppconnect/commit/c1f8f03476038bceb9f62fd6648124b774794551))

### Features

- Improved module loader ([#27](https://github.com/wppconnect-team/wppconnect/issues/27)) ([0f44d20](https://github.com/wppconnect-team/wppconnect/commit/0f44d2030b34c0101b3f34d995d824f240aa5548))

# [1.1.0](https://github.com/wppconnect-team/wppconnect/compare/v1.0.3...v1.1.0) (2021-02-27)

### Bug Fixes

- Fixed decryptFile function ([c92597b](https://github.com/wppconnect-team/wppconnect/commit/c92597bb7bda03ee5b4905881894e13e0003e24b))

### Features

- Allow pass browser/page in create method ([#19](https://github.com/wppconnect-team/wppconnect/issues/19)) ([a2902e8](https://github.com/wppconnect-team/wppconnect/commit/a2902e8840046407b56da59ba5d2c1e5c16b5c0b))

## [1.0.3](https://github.com/wppconnect-team/wppconnect/compare/v1.0.2...v1.0.3) (2021-02-26)

### Bug Fixes

- Fixed "sender" field in message return ([ca5f6ef](https://github.com/wppconnect-team/wppconnect/commit/ca5f6efea3bfcb6b58acd949d2d9035d1088de4f))

### chore

- Deprecated create with argument option position based ([020e71c](https://github.com/wppconnect-team/wppconnect/commit/020e71c7e95eb20a0a623b6e7c218f52c32a172b))

### BREAKING CHANGES

- Deprecated create from argument in favor of CreateOptions

## [1.0.2](https://github.com/wppconnect-team/wppconnect/compare/v1.0.1...v1.0.2) (2021-02-25)

### Bug Fixes

- WhatsApp Web v2.2106.5 compatibility ([fa9d575](https://github.com/wppconnect-team/wppconnect/commit/fa9d575bff21d2a97dda59378e49740b15460a63))

## [1.0.1](https://github.com/wppconnect-team/wppconnect/compare/v1.0.0...v1.0.1) (2021-02-24)

### Bug Fixes

- Fixed sendPtt from audio with codecs ([2a8b476](https://github.com/wppconnect-team/wppconnect/commit/2a8b476de07366267bb1e683ac632f2e6b815a75))

### Features

- Added sendPtt from file ([ae38c8e](https://github.com/wppconnect-team/wppconnect/commit/ae38c8e38c6c8b731b0ceda008c9224b497f42fd))

# [1.0.0](https://github.com/wppconnect-team/wppconnect/compare/v0.0.2...v1.0.0) (2021-02-24)
