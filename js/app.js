import { CODE_DATA } from './codeSnippets.js';
import {
  generateMergeSortSteps,
  generateFindMiddleSteps,
  generateMergeTwoSortedSteps,
  generateReverseListSteps
} from './algorithms.js';
import { LinkedListVisualizer } from './visualizer.js';

class LinkedListApp {
  constructor() {
    this.currentAlgorithm = "merge_sort"; // 'merge_sort' | 'find_middle' | 'merge_two_sorted' | 'reverse_list'
    this.currentLanguage = "cpp"; // 'cpp' | 'java' | 'python'
    this.currentSpeed = 1; // 0.5x to 4x multiplier
    this.isPlaying = false;
    this.playInterval = null;
    this.currentStepIndex = 0;
    this.steps = [];

    // Visualizer instance
    this.visualizerCanvas = document.getElementById("visualizerCanvas");
    this.visualizer = new LinkedListVisualizer(this.visualizerCanvas);

    // Initial default datasets
    this.datasets = {
      merge_sort: [4, 2, 1, 3],
      find_middle: [1, 2, 3, 4, 5],
      merge_two_sorted: {
        list1: [1, 3, 5],
        list2: [2, 4, 6]
      },
      reverse_list: [10, 20, 30, 40, 50]
    };

    this.initDOM();
    this.initEventListeners();
    this.initTheme();
    this.loadAlgorithm(this.currentAlgorithm);
  }

  initDOM() {
    // Top Tabs
    this.tabs = document.querySelectorAll(".nav-tab");
    this.themeToggleBtn = document.getElementById("themeToggleBtn");
    this.speedSlider = document.getElementById("speedSlider");
    this.speedValBadge = document.getElementById("speedValBadge");

    // Controls
    this.playBtn = document.getElementById("playBtn");
    this.stepBackBtn = document.getElementById("stepBackBtn");
    this.stepForwardBtn = document.getElementById("stepForwardBtn");
    this.resetBtn = document.getElementById("resetBtn");
    this.randomizeBtn = document.getElementById("randomizeBtn");
    this.inputField = document.getElementById("customInput");
    this.applyInputBtn = document.getElementById("applyInputBtn");
    this.inputContainer = document.getElementById("inputControlsContainer");

    // Scrubber / Progress
    this.stepScrubber = document.getElementById("stepScrubber");
    this.stepCounterText = document.getElementById("stepCounterText");
    this.stepProgressBar = document.getElementById("stepProgressBar");

    // Explanation Box
    this.explanationText = document.getElementById("explanationText");
    this.stageBadge = document.getElementById("stageBadge");

    // Left Panel Elements
    this.problemTitle = document.getElementById("problemTitle");
    this.timeComplexityBadge = document.getElementById("timeComplexityBadge");
    this.spaceComplexityBadge = document.getElementById("spaceComplexityBadge");
    this.problemDesc = document.getElementById("problemDescription");
    this.langSelect = document.getElementById("langSelect");
    this.codeContainer = document.getElementById("codeContainer");
    this.copyCodeBtn = document.getElementById("copyCodeBtn");

    // Accordions
    this.accordionHeaders = document.querySelectorAll(".accordion-header");
  }

  initTheme() {
    const savedTheme = localStorage.getItem("algo_theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    this.updateThemeButton(savedTheme);
  }

  updateThemeButton(theme) {
    if (theme === "light") {
      this.themeToggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <span>Light</span>
      `;
    } else {
      this.themeToggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
        <span>Dark</span>
      `;
    }
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("algo_theme", newTheme);
    this.updateThemeButton(newTheme);
  }

  initEventListeners() {
    // Theme toggle
    this.themeToggleBtn.addEventListener("click", () => this.toggleTheme());

    // Tab switching
    this.tabs.forEach(tab => {
      tab.addEventListener("click", (e) => {
        const algo = e.currentTarget.getAttribute("data-algo");
        if (algo && algo !== this.currentAlgorithm) {
          this.pause();
          this.tabs.forEach(t => t.classList.remove("active"));
          e.currentTarget.classList.add("active");
          this.loadAlgorithm(algo);
        }
      });
    });

    // Language selection
    this.langSelect.addEventListener("change", (e) => {
      this.currentLanguage = e.target.value;
      this.renderCodeBlock();
      this.highlightActiveLine();
    });

    // Copy code
    this.copyCodeBtn.addEventListener("click", () => {
      const codeLines = CODE_DATA[this.currentAlgorithm][this.currentLanguage].join("\n");
      navigator.clipboard.writeText(codeLines).then(() => {
        const originalText = this.copyCodeBtn.innerHTML;
        this.copyCodeBtn.innerHTML = `<span style="color:#10B981">✓ Copied!</span>`;
        setTimeout(() => {
          this.copyCodeBtn.innerHTML = originalText;
        }, 1500);
      });
    });

    // Speed slider
    this.speedSlider.addEventListener("input", (e) => {
      this.currentSpeed = parseFloat(e.target.value);
      this.speedValBadge.textContent = `${this.currentSpeed}x`;
      if (this.isPlaying) {
        this.pause();
        this.play();
      }
    });

    // Timeline controls
    this.playBtn.addEventListener("click", () => this.togglePlay());
    this.stepForwardBtn.addEventListener("click", () => this.stepForward());
    this.stepBackBtn.addEventListener("click", () => this.stepBack());
    this.resetBtn.addEventListener("click", () => this.resetAlgorithm());
    this.randomizeBtn.addEventListener("click", () => this.randomizeInput());
    this.applyInputBtn.addEventListener("click", () => this.applyCustomInput());

    // Scrubber
    this.stepScrubber.addEventListener("input", (e) => {
      this.pause();
      this.goToStep(parseInt(e.target.value, 10));
    });

    // Accordions
    this.accordionHeaders.forEach(header => {
      header.addEventListener("click", () => {
        const item = header.parentElement;
        item.classList.toggle("open");
      });
    });
  }

  loadAlgorithm(algoKey) {
    this.currentAlgorithm = algoKey;
    const algoData = CODE_DATA[algoKey];

    // Update left panel metadata
    this.problemTitle.textContent = algoData.title;
    this.timeComplexityBadge.textContent = `Time: ${algoData.complexity.time}`;
    this.spaceComplexityBadge.textContent = `Space: ${algoData.complexity.space}`;

    // Update Problem description & accordions
    this.updateProblemDetails(algoKey);

    // Setup input field based on algo
    this.setupInputField(algoKey);

    // Render code
    this.renderCodeBlock();

    // Generate steps
    this.generateStepsForCurrentAlgo();

    // Go to first step
    this.goToStep(0);
  }

  setupInputField(algoKey) {
    if (algoKey === "merge_two_sorted") {
      this.inputContainer.innerHTML = `
        <div class="dual-input-row">
          <div class="input-group-sub">
            <label>List 1:</label>
            <input type="text" id="customInput1" value="${this.datasets.merge_two_sorted.list1.join(', ')}" />
          </div>
          <div class="input-group-sub">
            <label>List 2:</label>
            <input type="text" id="customInput2" value="${this.datasets.merge_two_sorted.list2.join(', ')}" />
          </div>
          <button id="applyInputBtn" class="btn btn-secondary">Apply</button>
        </div>
      `;
      document.getElementById("applyInputBtn").addEventListener("click", () => this.applyCustomInput());
    } else {
      this.inputContainer.innerHTML = `
        <div class="input-group-main">
          <label>Custom Nodes:</label>
          <input type="text" id="customInput" value="${this.datasets[algoKey].join(', ')}" placeholder="e.g. 4, 2, 1, 3" />
          <button id="applyInputBtn" class="btn btn-secondary">Apply</button>
        </div>
      `;
      document.getElementById("applyInputBtn").addEventListener("click", () => this.applyCustomInput());
    }
  }

  updateProblemDetails(algoKey) {
    const details = {
      merge_sort: {
        desc: "Sort an unsorted singly linked list using the Divide and Conquer strategy. Unlike arrays, Merge Sort is the ideal choice for Linked Lists because it requires $O(1)$ extra pointer storage (no continuous array reallocation) and achieves guaranteed $O(N \\log N)$ optimal time complexity.",
        accordion1: `
          <h4>Why Merge Sort is Superior for Linked Lists:</h4>
          <ul>
            <li><strong>No Random Access Penalty:</strong> Quick Sort relies on $O(1)$ random indexing for partition selection, which costs $O(N)$ on linked lists.</li>
            <li><strong>$O(1)$ Space Merging:</strong> In arrays, merge sort requires $O(N)$ temporary memory to merge. In linked lists, merging is done purely by rewiring pointer links (repointing <code>.next</code>)!</li>
            <li><strong>Guaranteed Worst-case Performance:</strong> $O(N \\log N)$ even with sorted, reverse, or duplicate inputs.</li>
          </ul>
        `,
        accordion2: `
          <h4>Key Edge Cases Handled:</h4>
          <ul>
            <li><strong>Empty List (<code>head == NULL</code>):</strong> Handled in $O(1)$ base case.</li>
            <li><strong>Single Node (<code>head->next == NULL</code>):</strong> Naturally sorted, returns immediately.</li>
            <li><strong>Odd vs Even Length Lists:</strong> Tortoise & Hare initialization handles even splits cleanly without off-by-one errors.</li>
            <li><strong>Duplicate Values:</strong> The merge function preserves stability using <code>l1->val <= l2->val</code>.</li>
          </ul>
        `
      },
      find_middle: {
        desc: "Find the middle node of a linked list in a single traversal using Floyd's Tortoise and Hare (Slow & Fast pointer) algorithm. Essential building block for dividing linked lists during Merge Sort.",
        accordion1: `
          <h4>Pointer Mechanics:</h4>
          <ul>
            <li><code>slow</code> pointer advances <strong>1 node</strong> per iteration.</li>
            <li><code>fast</code> pointer advances <strong>2 nodes</strong> per iteration.</li>
            <li>When <code>fast</code> reaches the end (or NULL), <code>slow</code> is guaranteed to be at the exact midpoint!</li>
          </ul>
        `,
        accordion2: `
          <h4>Even vs Odd Length:</h4>
          <ul>
            <li><strong>Odd Count:</strong> Exact center node is returned.</li>
            <li><strong>Even Count:</strong> LeetCode convention returns the second middle node (or first middle depending on pointer initialization <code>fast = head->next</code>).</li>
          </ul>
        `
      },
      merge_two_sorted: {
        desc: "Merge two sorted linked lists into a single sorted linked list in $O(N + M)$ time and $O(1)$ auxiliary space by splicing together existing node links using a Dummy Head pointer.",
        accordion1: `
          <h4>The Dummy Head Paradigm:</h4>
          <ul>
            <li>Using a temporary <code>dummy</code> node eliminates edge cases where the head changes or the list is initially empty.</li>
            <li><code>tail</code> keeps track of the end of the sorted list, appending the smaller value at each step.</li>
          </ul>
        `,
        accordion2: `
          <h4>Post-Loop Optimization:</h4>
          <ul>
            <li>When one list finishes, the remaining elements of the other list are already sorted. They are attached in $O(1)$ time by setting <code>tail->next = remaining_list</code>.</li>
          </ul>
        `
      },
      reverse_list: {
        desc: "Reverse a singly linked list in $O(N)$ time and $O(1)$ space by iteratively flipping directional pointer links using three sliding pointers: prev, curr, and nextTemp.",
        accordion1: `
          <h4>The 4-Step Pointer Shuffle:</h4>
          <ol>
            <li><code>nextTemp = curr->next</code> (Preserve forward link)</li>
            <li><code>curr->next = prev</code> (Flip arrow backward)</li>
            <li><code>prev = curr</code> (Advance prev forward)</li>
            <li><code>curr = nextTemp</code> (Advance curr forward)</li>
          </ol>
        `,
        accordion2: `
          <h4>Invariants & Clean Exit:</h4>
          <ul>
            <li>At loop termination, <code>curr</code> is NULL and <code>prev</code> points to the new head of the reversed list.</li>
          </ul>
        `
      }
    };

    const d = details[algoKey];
    this.problemDesc.innerHTML = `<p>${d.desc}</p>`;
    document.getElementById("accordionContent1").innerHTML = d.accordion1;
    document.getElementById("accordionContent2").innerHTML = d.accordion2;
  }

  renderCodeBlock() {
    const lines = CODE_DATA[this.currentAlgorithm][this.currentLanguage];
    let html = `<table class="code-table">`;
    lines.forEach((line, index) => {
      const lineNum = index + 1;
      html += `
        <tr class="code-line-tr" id="code-line-${lineNum}">
          <td class="line-num">${lineNum}</td>
          <td class="line-code"><code>${this.syntaxHighlight(line, this.currentLanguage)}</code></td>
        </tr>
      `;
    });
    html += `</table>`;
    this.codeContainer.innerHTML = html;
  }

  syntaxHighlight(code, lang) {
    // Clean lightweight syntax highlighter for C++, Java, Python
    return code
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/(\/\/.*$|#.*$)/g, '<span class="token-comment">$1</span>')
      .replace(/\b(ListNode|def|return|if|else|while|class|public|private|new|nullptr|null|None|Optional)\b/g, '<span class="token-keyword">$1</span>')
      .replace(/\b(head|slow|fast|mid|left|right|l1|l2|dummy|tail|prev|curr|nextTemp|next|val)\b/g, '<span class="token-var">$1</span>')
      .replace(/\b([0-9]+)\b/g, '<span class="token-number">$1</span>');
  }

  generateStepsForCurrentAlgo() {
    if (this.currentAlgorithm === "merge_sort") {
      this.steps = generateMergeSortSteps(this.datasets.merge_sort);
    } else if (this.currentAlgorithm === "find_middle") {
      this.steps = generateFindMiddleSteps(this.datasets.find_middle);
    } else if (this.currentAlgorithm === "merge_two_sorted") {
      this.steps = generateMergeTwoSortedSteps(
        this.datasets.merge_two_sorted.list1,
        this.datasets.merge_two_sorted.list2
      );
    } else if (this.currentAlgorithm === "reverse_list") {
      this.steps = generateReverseListSteps(this.datasets.reverse_list);
    }

    this.stepScrubber.max = this.steps.length - 1;
    this.stepScrubber.value = 0;
  }

  goToStep(index) {
    if (index < 0) index = 0;
    if (index >= this.steps.length) index = this.steps.length - 1;

    this.currentStepIndex = index;
    const step = this.steps[this.currentStepIndex];

    // Update scrubber & counter
    this.stepScrubber.value = index;
    this.stepCounterText.textContent = `Step ${index + 1} of ${this.steps.length}`;
    const progressPercent = ((index + 1) / this.steps.length) * 100;
    this.stepProgressBar.style.width = `${progressPercent}%`;

    // Update state explanation
    this.explanationText.textContent = step.explanation;
    this.stageBadge.textContent = step.stage.replace(/_/g, " ").toUpperCase();

    // Render Canvas
    this.visualizer.render(step, this.currentAlgorithm);

    // Synchronize Code Line highlight
    this.highlightActiveLine(step.codeLines ? step.codeLines[this.currentLanguage] : null);

    // Update button states
    this.stepBackBtn.disabled = index === 0;
    this.stepForwardBtn.disabled = index === this.steps.length - 1;

    if (index === this.steps.length - 1 && this.isPlaying) {
      this.pause();
    }
  }

  highlightActiveLine(targetLine) {
    document.querySelectorAll(".code-line-tr").forEach(tr => tr.classList.remove("active-line"));
    if (targetLine) {
      const lineElem = document.getElementById(`code-line-${targetLine}`);
      if (lineElem) {
        lineElem.classList.add("active-line");
        lineElem.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    if (this.currentStepIndex >= this.steps.length - 1) {
      this.goToStep(0);
    }
    this.isPlaying = true;
    this.playBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
      </svg>
      <span>Pause</span>
    `;
    this.playBtn.classList.add("btn-active-playing");

    const baseInterval = 1200; // ms
    const intervalMs = baseInterval / this.currentSpeed;

    this.playInterval = setInterval(() => {
      if (this.currentStepIndex < this.steps.length - 1) {
        this.goToStep(this.currentStepIndex + 1);
      } else {
        this.pause();
      }
    }, intervalMs);
  }

  pause() {
    this.isPlaying = false;
    clearInterval(this.playInterval);
    this.playBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5,3 19,12 5,21"></polygon>
      </svg>
      <span>Play</span>
    `;
    this.playBtn.classList.remove("btn-active-playing");
  }

  stepForward() {
    this.pause();
    if (this.currentStepIndex < this.steps.length - 1) {
      this.goToStep(this.currentStepIndex + 1);
    }
  }

  stepBack() {
    this.pause();
    if (this.currentStepIndex > 0) {
      this.goToStep(this.currentStepIndex - 1);
    }
  }

  resetAlgorithm() {
    this.pause();
    this.goToStep(0);
  }

  randomizeInput() {
    this.pause();
    if (this.currentAlgorithm === "merge_two_sorted") {
      const len1 = Math.floor(Math.random() * 3) + 3;
      const len2 = Math.floor(Math.random() * 3) + 3;
      const r1 = Array.from({ length: len1 }, () => Math.floor(Math.random() * 40) + 1).sort((a,b)=>a-b);
      const r2 = Array.from({ length: len2 }, () => Math.floor(Math.random() * 40) + 1).sort((a,b)=>a-b);
      this.datasets.merge_two_sorted.list1 = r1;
      this.datasets.merge_two_sorted.list2 = r2;
    } else {
      const len = Math.floor(Math.random() * 4) + 4; // 4 to 7 nodes
      const randomArr = Array.from({ length: len }, () => Math.floor(Math.random() * 50) + 1);
      this.datasets[this.currentAlgorithm] = randomArr;
    }

    this.setupInputField(this.currentAlgorithm);
    this.generateStepsForCurrentAlgo();
    this.goToStep(0);
  }

  applyCustomInput() {
    this.pause();
    try {
      if (this.currentAlgorithm === "merge_two_sorted") {
        const val1 = document.getElementById("customInput1").value;
        const val2 = document.getElementById("customInput2").value;
        const arr1 = val1.split(",").map(v => parseInt(v.trim(), 10)).filter(n => !isNaN(n));
        const arr2 = val2.split(",").map(v => parseInt(v.trim(), 10)).filter(n => !isNaN(n));
        if (arr1.length === 0 || arr2.length === 0) {
          alert("Please enter valid comma-separated numbers for both lists!");
          return;
        }
        this.datasets.merge_two_sorted.list1 = arr1.slice(0, 7);
        this.datasets.merge_two_sorted.list2 = arr2.slice(0, 7);
      } else {
        const val = document.getElementById("customInput").value;
        const arr = val.split(",").map(v => parseInt(v.trim(), 10)).filter(n => !isNaN(n));
        if (arr.length === 0) {
          alert("Please enter valid comma-separated numbers (e.g. 4, 2, 1, 3)!");
          return;
        }
        this.datasets[this.currentAlgorithm] = arr.slice(0, 8); // limit for optimal visual presentation
      }

      this.generateStepsForCurrentAlgo();
      this.goToStep(0);
    } catch (err) {
      alert("Invalid input format. Please use comma-separated integers.");
    }
  }
}

// Instantiate on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  window.app = new LinkedListApp();
});
