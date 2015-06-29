import TextTrackMenuItem from '../../../src/js/control-bar/text-track-controls/text-track-menu-item.js';
import TestHelpers from '../test-helpers.js';
import * as browser from '../../../src/js/utils/browser.js';

q.module('Text Track Controls');

var track = {
  kind: 'captions',
  label: 'test'
};

test('should be displayed when text tracks list is not empty', function() {
  var player = TestHelpers.makePlayer({
    tracks: [track]
  });

  ok(!player.controlBar.captionsButton.hasClass('vjs-hidden'), 'control is displayed');
  equal(player.textTracks().length, 1, 'textTracks contains one item');
});

test('should be displayed when a text track is added to an empty track list', function() {
  var player = TestHelpers.makePlayer();

  player.addRemoteTextTrack(track);

  ok(!player.controlBar.captionsButton.hasClass('vjs-hidden'), 'control is displayed');
  equal(player.textTracks().length, 1, 'textTracks contains one item');
});

test('should not be displayed when text tracks list is empty', function() {
  var player = TestHelpers.makePlayer();

  equal(player.textTracks().length, 0, 'textTracks is empty');
});

test('should not be displayed when last text track is removed', function() {
  var player = TestHelpers.makePlayer({
    tracks: [track]
  });

  player.removeRemoteTextTrack(player.textTracks()[0]);

  equal(player.textTracks().length, 0, 'textTracks is empty');
});

test('menu should contain "Settings", "Off" and one track', function() {
  var player = TestHelpers.makePlayer({
      tracks: [track]
    }),
    menuItems = player.controlBar.captionsButton.items;

  equal(menuItems.length, 4, 'menu contains three items');
  equal(menuItems[0].track.label, 'captions settings', 'menu contains "captions settings"');
  equal(menuItems[1].track.label, 'Closed captions', 'menu contains "Closed captions"');
  equal(menuItems[2].track.label, 'None', 'menu contains "None"');
  equal(menuItems[3].track.label, 'test', 'menu contains "test" track');
});

test('menu should update with addRemoteTextTrack', function() {
  var player = TestHelpers.makePlayer({
    tracks: [track]
  });

  player.addRemoteTextTrack(track);

  equal(player.controlBar.captionsButton.items.length, 5, 'menu does contain added track');
  equal(player.textTracks().length, 2, 'textTracks contains two items');
});

test('menu should update with removeRemoteTextTrack', function() {
  var player = TestHelpers.makePlayer({
    tracks: [track, track]
  });

  player.removeRemoteTextTrack(player.textTracks()[0]);

  equal(player.controlBar.captionsButton.items.length, 4, 'menu does not contain removed track');
  equal(player.textTracks().length, 1, 'textTracks contains one item');
});

if (!browser.IS_IE8) {
  // This test doesn't work on IE8.
  // However, this test tests a specific with iOS7 where the TextTrackList doesn't report track mode changes.
  // TODO: figure out why this test doens't work on IE8. https://github.com/videojs/video.js/issues/1861
  test('menu items should polyfill mode change events', function() {
    var player = TestHelpers.makePlayer({}),
        changes,
        trackMenuItem;

    // emulate a TextTrackList that doesn't report track mode changes,
    // like iOS7
    player.textTracks().onchange = undefined;
    trackMenuItem = new TextTrackMenuItem(player, {
      track: track
    });

    player.textTracks().on('change', function() {
      changes++;
    });
    changes = 0;
    trackMenuItem.trigger('tap');
    equal(changes, 1, 'taps trigger change events');

    trackMenuItem.trigger('click');
    equal(changes, 2, 'clicks trigger change events');
  });
}
