import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'http://127.0.0.1:5173/';
const SCREENSHOT_DIR = path.resolve('test-screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runTests() {
  console.log('🚀 Starting Tic-Tac-Toe End-to-End Test Suite...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => {
    consoleErrors.push(err.toString());
  });

  const results = {
    xWin: false,
    oWin: false,
    draw: false,
    occupiedCell: false,
    gameOverLock: false,
    restart: false,
    scoreboard: false,
    resetScore: false,
    responsive: false,
    consoleErrors: consoleErrors
  };

  try {
    await page.goto(URL, { waitUntil: 'networkidle0' });
    console.log('✅ Page loaded successfully');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-initial-state.png') });

    // Test 1: Player X Wins
    console.log('▶ Running Test 1: Player X Wins (X: 0, 1, 2)');
    await page.click('#cell-0'); // X
    await page.click('#cell-3'); // O
    await page.click('#cell-1'); // X
    await page.click('#cell-4'); // O
    await page.click('#cell-2'); // X

    await page.waitForSelector('#game-result-message', { timeout: 3000 });
    const resultTextX = await page.$eval('#game-result-message', (el) => el.textContent.trim());
    const scoreXValue1 = await page.$eval('#score-x', (el) => el.textContent.trim());
    const cell0Winning = await page.$eval('#cell-0', (el) => el.classList.contains('cell-winning'));
    const cell1Winning = await page.$eval('#cell-1', (el) => el.classList.contains('cell-winning'));
    const cell2Winning = await page.$eval('#cell-2', (el) => el.classList.contains('cell-winning'));

    if (resultTextX === 'Player X Wins!' && scoreXValue1 === '1' && cell0Winning && cell1Winning && cell2Winning) {
      results.xWin = true;
      console.log('  ✔ Test 1 Passed: Player X Wins detected, winning line highlighted, score incremented.');
    } else {
      console.error('  ✖ Test 1 Failed:', { resultTextX, scoreXValue1, cell0Winning, cell1Winning, cell2Winning });
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-player-x-wins.png') });

    // Test 5: Game Over - clicking empty cell does nothing
    console.log('▶ Running Test 5: Game Over Lock (clicking cell-8 when game is won)');
    await page.click('#cell-8');
    const cell8EmptyAfterClick = await page.$eval('#cell-8', (el) => el.classList.contains('cell-empty'));
    if (cell8EmptyAfterClick) {
      results.gameOverLock = true;
      console.log('  ✔ Test 5 Passed: Board is locked after win.');
    } else {
      console.error('  ✖ Test 5 Failed: Cell 8 was modified after game over.');
    }

    // Test 6: Restart
    console.log('▶ Running Test 6: Restart functionality');
    await page.click('#btn-restart');
    await page.waitForFunction(() => !document.querySelector('#game-result-message'));
    const allCellsEmptyAfterRestart = await page.$$eval('.cell', (cells) =>
      cells.every((c) => c.classList.contains('cell-empty'))
    );
    const scoreXPreserved = await page.$eval('#score-x', (el) => el.textContent.trim());
    if (allCellsEmptyAfterRestart && scoreXPreserved === '1') {
      results.restart = true;
      console.log('  ✔ Test 6 Passed: Restart cleared cells and preserved scores.');
    } else {
      console.error('  ✖ Test 6 Failed:', { allCellsEmptyAfterRestart, scoreXPreserved });
    }

    // Test 2: Player O Wins
    console.log('▶ Running Test 2: Player O Wins');
    // Moves: X:0, O:3, X:1, O:4, X:6, O:5 -> Row 2 (3, 4, 5) for O
    await page.click('#cell-0'); // X
    await page.click('#cell-3'); // O
    await page.click('#cell-1'); // X
    await page.click('#cell-4'); // O
    await page.click('#cell-6'); // X
    await page.click('#cell-5'); // O

    await page.waitForSelector('#game-result-message', { timeout: 3000 });
    const resultTextO = await page.$eval('#game-result-message', (el) => el.textContent.trim());
    const scoreOValue1 = await page.$eval('#score-o', (el) => el.textContent.trim());
    const cell3Winning = await page.$eval('#cell-3', (el) => el.classList.contains('cell-winning'));
    const cell4Winning = await page.$eval('#cell-4', (el) => el.classList.contains('cell-winning'));
    const cell5Winning = await page.$eval('#cell-5', (el) => el.classList.contains('cell-winning'));

    if (resultTextO === 'Player O Wins!' && scoreOValue1 === '1' && cell3Winning && cell4Winning && cell5Winning) {
      results.oWin = true;
      console.log('  ✔ Test 2 Passed: Player O Wins detected, winning line highlighted, score incremented.');
    } else {
      console.error('  ✖ Test 2 Failed:', { resultTextO, scoreOValue1 });
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-player-o-wins.png') });

    // Test 4: Occupied Cell protection
    console.log('▶ Running Test 4: Occupied Cell Protection');
    await page.click('#btn-restart');
    await page.click('#cell-4'); // X takes center
    const initialCell4Class = await page.$eval('#cell-4', (el) => el.className);
    await page.click('#cell-4'); // Attempt to click again
    const afterCell4Class = await page.$eval('#cell-4', (el) => el.className);
    const turnAfterReclick = await page.$eval('#turn-indicator', (el) => el.textContent);
    if (initialCell4Class === afterCell4Class && turnAfterReclick.includes('Player O')) {
      results.occupiedCell = true;
      console.log('  ✔ Test 4 Passed: Occupied cell cannot be clicked, turn maintained.');
    } else {
      console.error('  ✖ Test 4 Failed:', { initialCell4Class, afterCell4Class, turnAfterReclick });
    }

    // Test 3: Draw
    console.log('▶ Running Test 3: Draw detection');
    await page.click('#btn-restart');
    // Draw pattern:
    // 0(X), 1(O), 2(X)
    // 4(O), 3(X), 5(O)
    // 7(X), 6(O), 8(X)
    const drawMoves = [0, 1, 2, 4, 3, 5, 7, 6, 8];
    for (const cellIdx of drawMoves) {
      await page.click(`#cell-${cellIdx}`);
    }

    await page.waitForSelector('#game-result-message', { timeout: 3000 });
    const resultTextDraw = await page.$eval('#game-result-message', (el) => el.textContent.trim());
    const scoreDraws1 = await page.$eval('#score-draws', (el) => el.textContent.trim());

    if (resultTextDraw === "It's a Draw!" && scoreDraws1 === '1') {
      results.draw = true;
      console.log('  ✔ Test 3 Passed: Draw detected correctly, draws count incremented.');
    } else {
      console.error('  ✖ Test 3 Failed:', { resultTextDraw, scoreDraws1 });
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-draw-state.png') });

    // Test 7: Scoreboard verification
    console.log('▶ Running Test 7: Scoreboard Cumulative Tracking');
    const finalScoreX = await page.$eval('#score-x', (el) => el.textContent.trim());
    const finalScoreO = await page.$eval('#score-o', (el) => el.textContent.trim());
    const finalScoreDraws = await page.$eval('#score-draws', (el) => el.textContent.trim());
    if (finalScoreX === '1' && finalScoreO === '1' && finalScoreDraws === '1') {
      results.scoreboard = true;
      console.log('  ✔ Test 7 Passed: Scoreboard accurately tracks X: 1, O: 1, Draws: 1.');
    } else {
      console.error('  ✖ Test 7 Failed:', { finalScoreX, finalScoreO, finalScoreDraws });
    }

    // Test 8: Reset Score
    console.log('▶ Running Test 8: Reset Score');
    await page.click('#btn-reset-score');
    const resetScoreX = await page.$eval('#score-x', (el) => el.textContent.trim());
    const resetScoreO = await page.$eval('#score-o', (el) => el.textContent.trim());
    const resetScoreDraws = await page.$eval('#score-draws', (el) => el.textContent.trim());
    if (resetScoreX === '0' && resetScoreO === '0' && resetScoreDraws === '0') {
      results.resetScore = true;
      console.log('  ✔ Test 8 Passed: Reset Score restored all values to 0.');
    } else {
      console.error('  ✖ Test 8 Failed:', { resetScoreX, resetScoreO, resetScoreDraws });
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-scores-reset.png') });

    // Test 9: Responsive Testing (Mobile Viewport)
    console.log('▶ Running Test 9: Responsive Design');
    await page.setViewport({ width: 375, height: 667, isMobile: true });
    await page.waitForNetworkIdle();
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    const boardIsVisible = await page.$eval('#game-board', (el) => {
      const rect = el.getBoundingClientRect();
      return rect.width > 200 && Math.abs(rect.width - rect.height) < 4; // square
    });

    if (!hasHorizontalOverflow && boardIsVisible) {
      results.responsive = true;
      console.log('  ✔ Test 9 Passed: Mobile viewport has zero horizontal overflow and square board.');
    } else {
      console.error('  ✖ Test 9 Failed:', { hasHorizontalOverflow, boardIsVisible });
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-mobile-viewport.png') });

  } catch (error) {
    console.error('Critical test error:', error);
  } finally {
    await browser.close();
  }

  console.log('\n=======================================');
  console.log('🎯 SUMMARY OF TEST RESULTS:');
  console.log('X Win Test:', results.xWin ? 'PASS' : 'FAIL');
  console.log('O Win Test:', results.oWin ? 'PASS' : 'FAIL');
  console.log('Draw Test:', results.draw ? 'PASS' : 'FAIL');
  console.log('Invalid Move Test:', results.occupiedCell ? 'PASS' : 'FAIL');
  console.log('Game Over Test:', results.gameOverLock ? 'PASS' : 'FAIL');
  console.log('Restart Test:', results.restart ? 'PASS' : 'FAIL');
  console.log('Scoreboard Test:', results.scoreboard ? 'PASS' : 'FAIL');
  console.log('Reset Score Test:', results.resetScore ? 'PASS' : 'FAIL');
  console.log('Responsive Test:', results.responsive ? 'PASS' : 'FAIL');
  console.log('Console Errors:', results.consoleErrors.length === 0 ? 'NO' : `YES (${results.consoleErrors.join(', ')})`);
  console.log('=======================================\n');

  fs.writeFileSync('test-results.json', JSON.stringify(results, null, 2));
}

runTests();
