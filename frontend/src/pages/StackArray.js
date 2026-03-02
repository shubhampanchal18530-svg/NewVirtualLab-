
// Stack implementation with DOM manipulation
const STACK_SIZE = 5;
let stack = new Array(STACK_SIZE);
let top = -1;

// DOM elements
const input = document.getElementById('stack-input');
const pushBtn = document.querySelector('.push-btn');
const popBtn = document.querySelector('.pop-btn');
const resetBtn = document.querySelector('.reset-btn');
const stackContainer = document.querySelector('.stack-container');




// Info and log elements
const stackSizeInfo = document.getElementById('stack-size-info');
const stackTopInfo = document.getElementById('stack-top-info');
const stackLogList = document.getElementById('stack-log-list');

// Speed control
const speedSlider = document.getElementById('stack-speed-slider');
const speedValue = document.getElementById('stack-speed-value');
let animDuration = 400;
if (speedSlider && speedValue) {
  speedSlider.addEventListener('input', () => {
    animDuration = parseInt(speedSlider.value, 10);
    speedValue.textContent = animDuration + 'ms';
  });
  animDuration = parseInt(speedSlider.value, 10);
  speedValue.textContent = animDuration + 'ms';
}

// Warning message display
let warningMsg = document.createElement('div');
warningMsg.className = 'stack-warning';
warningMsg.setAttribute('aria-live', 'polite');
stackContainer.parentNode.insertBefore(warningMsg, stackContainer);

// Top pointer display
let topPointer = document.createElement('div');
topPointer.className = 'top-pointer';
topPointer.style.marginBottom = '10px';
stackContainer.parentNode.insertBefore(topPointer, stackContainer);


function updateTopPointer() {
  if (top === -1) {
    topPointer.textContent = 'Top: -1 (Stack Empty)';
  } else {
    topPointer.textContent = `Top: ${top}`;
  }
  // Update info panel
  if (stackSizeInfo) stackSizeInfo.textContent = `Stack Size: ${top + 1}`;
  if (stackTopInfo) stackTopInfo.textContent = `Top Index: ${top}`;
}

function logOperation(msg) {
  if (!stackLogList) return;
  const li = document.createElement('li');
  li.textContent = msg;
  stackLogList.insertBefore(li, stackLogList.firstChild);
  // Keep only last 8 logs
  while (stackLogList.children.length > 8) {
    stackLogList.removeChild(stackLogList.lastChild);
  }
}



function showWarning(message) {
  warningMsg.textContent = message;
  warningMsg.classList.add('show');
  setTimeout(() => {
    warningMsg.classList.remove('show');
    warningMsg.textContent = '';
  }, 1800);
}


function renderStack(anim = null) {
  stackContainer.innerHTML = '';
  for (let i = STACK_SIZE - 1; i >= 0; i--) {
    if (stack[i] !== undefined) {
      const block = document.createElement('div');
      block.className = 'stack-block' + (i === top ? ' top' : '');
      block.textContent = stack[i];
      // Animation for PUSH
      if (anim && anim.type === 'push' && i === top) {
        block.classList.add('push-anim');
        stackContainer.appendChild(block);
        // Force reflow
        void block.offsetWidth;
        setTimeout(() => {
          block.classList.add('push-anim-active');
        }, 10);
        setTimeout(() => {
          block.classList.remove('push-anim', 'push-anim-active');
        }, animDuration + 10);
        continue;
      }
      stackContainer.appendChild(block);
    }
  }
  updateTopPointer();
  updateButtonStates();
}





function push(value) {
  if (top >= STACK_SIZE - 1) {
    showWarning('Stack Overflow!');
    logOperation('PUSH failed: Stack Overflow!');
    return;
  }
  top++;
  stack[top] = value;
  renderStack({ type: 'push' });
  logOperation(`PUSH: Inserted "${value}" at index ${top}`);
}





function pop() {
  if (top < 0) {
    showWarning('Stack Underflow!');
    logOperation('POP failed: Stack Underflow!');
    return;
  }
  const poppedValue = stack[top];
  // Find the top block DOM element
  const blocks = stackContainer.querySelectorAll('.stack-block');
  if (blocks.length > 0) {
    const topBlock = blocks[blocks.length - 1];
    topBlock.classList.add('pop-anim');
    setTimeout(() => {
      stack[top] = undefined;
      logOperation(`POP: Removed "${poppedValue}" from index ${top}`);
      top--;
      renderStack();
    }, animDuration);
  } else {
    stack[top] = undefined;
    logOperation(`POP: Removed "${poppedValue}" from index ${top}`);
    top--;
    renderStack();
  }
}



function resetStack() {
  stack = new Array(STACK_SIZE);
  top = -1;
  renderStack();
  logOperation('Stack reset.');
}

function updateButtonStates() {
  if (pushBtn) pushBtn.disabled = (top >= STACK_SIZE - 1);
  if (popBtn) popBtn.disabled = (top < 0);
}


pushBtn.addEventListener('click', () => {
  const value = input.value.trim();
  if (value === '') {
    showWarning('Please enter a value.');
    return;
  }
  push(value);
  input.value = '';
  input.focus();
});

popBtn.addEventListener('click', () => {
  pop();
});

resetBtn.addEventListener('click', () => {
  resetStack();
});



// Initial render
renderStack();
logOperation('Stack initialized.');
