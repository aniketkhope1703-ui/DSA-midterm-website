/* Visualizer renderer for Linked List nodes, pointer badges, SVG arrows, and tree levels */

export class LinkedListVisualizer {
  constructor(containerElement) {
    this.container = containerElement;
  }

  /**
   * Main render dispatcher based on current algorithm tab
   */
  render(stepData, currentAlgorithm) {
    if (!stepData) {
      this.container.innerHTML = `<div class="empty-state">No steps to display. Click 'Play' or 'Step Forward'.</div>`;
      return;
    }

    switch (currentAlgorithm) {
      case "merge_sort":
        this.renderMergeSort(stepData);
        break;
      case "find_middle":
        this.renderFindMiddle(stepData);
        break;
      case "merge_two_sorted":
        this.renderMergeTwoSorted(stepData);
        break;
      case "reverse_list":
        this.renderReverseList(stepData);
        break;
      default:
        this.container.innerHTML = `<div>Unknown algorithm</div>`;
    }
  }

  /**
   * Helper: create pointer badge HTML
   */
  getPointerBadges(nodeId, pointers) {
    if (!pointers) return "";
    const badges = [];

    const badgeConfig = {
      head: { label: "HEAD", color: "badge-amber" },
      slow: { label: "SLOW 🐢", color: "badge-cyan" },
      fast: { label: "FAST 🐇", color: "badge-indigo" },
      mid: { label: "MID ✂️", color: "badge-crimson" },
      left: { label: "LEFT", color: "badge-cyan" },
      right: { label: "RIGHT", color: "badge-purple" },
      l1: { label: "L1", color: "badge-cyan" },
      l2: { label: "L2", color: "badge-purple" },
      tail: { label: "TAIL", color: "badge-emerald" },
      dummy: { label: "DUMMY", color: "badge-gray" },
      prev: { label: "PREV", color: "badge-purple" },
      curr: { label: "CURR", color: "badge-cyan" },
      nextTemp: { label: "NEXT_TEMP", color: "badge-indigo" }
    };

    for (const [key, targetId] of Object.entries(pointers)) {
      if (targetId === nodeId && badgeConfig[key]) {
        const cfg = badgeConfig[key];
        badges.push(`<span class="pointer-badge ${cfg.color}" title="${cfg.label} pointer">${cfg.label}</span>`);
      }
    }

    if (badges.length === 0) return "";
    return `<div class="pointer-badge-container">${badges.join("")}</div>`;
  }

  /**
   * Helper: create a single linked list node HTML element
   */
  createNodeHTML(node, index, options = {}) {
    const {
      pointers = {},
      highlights = {},
      isCutAfter = false,
      isReversed = false,
      isLast = false
    } = options;

    const highlightClass = highlights[node.id] || "";
    const pointerHTML = this.getPointerBadges(node.id, pointers);

    return `
      <div class="node-wrapper" data-node-id="${node.id}">
        ${pointerHTML}
        <div class="ll-node ${highlightClass} ${node.isDummy ? 'node-dummy' : ''}">
          <div class="node-val">${node.val}</div>
          <div class="node-next-slot" title="Next Pointer">
            <span class="slot-dot"></span>
          </div>
        </div>
        ${this.createArrowHTML({ isCutAfter, isReversed, isLast })}
      </div>
    `;
  }

  /**
   * Helper: directional arrow or NULL termination
   */
  createArrowHTML({ isCutAfter = false, isReversed = false, isLast = false }) {
    if (isCutAfter) {
      return `
        <div class="arrow-container severed-arrow" title="Pointer severed: next = NULL">
          <span class="sever-icon">✂️</span>
          <div class="sever-line"></div>
          <span class="null-pill red-null">NULL</span>
        </div>
      `;
    }

    if (isLast) {
      return `
        <div class="arrow-container null-container">
          <svg class="arrow-svg" viewBox="0 0 40 24">
            <line x1="2" y1="12" x2="32" y2="12" stroke="currentColor" stroke-width="2.5" />
            <polygon points="30,8 38,12 30,16" fill="currentColor" />
          </svg>
          <span class="null-pill">NULL</span>
        </div>
      `;
    }

    if (isReversed) {
      return `
        <div class="arrow-container reversed-arrow">
          <svg class="arrow-svg" viewBox="0 0 40 24">
            <line x1="8" y1="12" x2="38" y2="12" stroke="currentColor" stroke-width="2.5" />
            <polygon points="10,8 2,12 10,16" fill="currentColor" />
          </svg>
        </div>
      `;
    }

    return `
      <div class="arrow-container">
        <svg class="arrow-svg" viewBox="0 0 40 24">
          <line x1="2" y1="12" x2="32" y2="12" stroke="currentColor" stroke-width="2.5" />
          <polygon points="30,8 38,12 30,16" fill="currentColor" />
        </svg>
      </div>
    `;
  }

  /**
   * 1. RENDER: Merge Sort on Linked List
   */
  renderMergeSort(step) {
    const { tree, pointers, highlights, cutLink, activeSublistId, callStack } = step;

    let html = `
      <div class="merge-sort-visualizer">
        <!-- Call Stack Mini Banner -->
        <div class="call-stack-strip">
          <span class="stack-label">Active Stack:</span>
          <div class="stack-tags">
            ${callStack.map((frame, i) => `
              <span class="stack-pill ${i === callStack.length - 1 ? 'stack-active' : ''}">
                ${frame}
              </span>
            `).join("")}
          </div>
        </div>

        <!-- Tree Levels breakdown -->
        <div class="tree-levels-container">
    `;

    tree.forEach((levelSublists, lvlIdx) => {
      html += `
        <div class="tree-level" data-level="${lvlIdx}">
          <div class="level-indicator">Level ${lvlIdx} ${lvlIdx === 0 ? '(Original)' : ''}</div>
          <div class="sublists-row">
      `;

      levelSublists.forEach(sub => {
        const isActiveSub = sub.id === activeSublistId;
        html += `
          <div class="sublist-card ${isActiveSub ? 'sublist-active' : ''}">
            <div class="sublist-nodes-flow">
        `;

        sub.nodes.forEach((node, nIdx) => {
          const isCutAfter = cutLink && cutLink.fromId === node.id;
          const isLast = nIdx === sub.nodes.length - 1;

          html += this.createNodeHTML(node, nIdx, {
            pointers,
            highlights,
            isCutAfter,
            isLast
          });
        });

        html += `
            </div>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    this.container.innerHTML = html;
  }

  /**
   * 2. RENDER: Find Middle of Linked List
   */
  renderFindMiddle(step) {
    const { nodes, pointers, highlights, stats } = step;

    let html = `
      <div class="find-middle-visualizer">
        <!-- Tortoise & Hare Stats Bar -->
        <div class="stats-overview-grid">
          <div class="stat-box cyan-stat">
            <span class="stat-icon">🐢</span>
            <div class="stat-info">
              <span class="stat-name">Slow (Tortoise)</span>
              <span class="stat-val">Index ${stats.slowIndex} (Val: ${nodes[stats.slowIndex]?.val})</span>
              <span class="stat-hint">+1 step / cycle</span>
            </div>
          </div>
          <div class="stat-box indigo-stat">
            <span class="stat-icon">🐇</span>
            <div class="stat-info">
              <span class="stat-name">Fast (Hare)</span>
              <span class="stat-val">${stats.fastIndex < nodes.length ? `Index ${stats.fastIndex} (Val: ${nodes[stats.fastIndex]?.val})` : 'NULL (Out of bounds)'}</span>
              <span class="stat-hint">+2 steps / cycle</span>
            </div>
          </div>
          <div class="stat-box emerald-stat">
            <span class="stat-icon">📏</span>
            <div class="stat-info">
              <span class="stat-name">List Metadata</span>
              <span class="stat-val">${stats.totalLength} nodes (${stats.isEven ? 'Even' : 'Odd'})</span>
              <span class="stat-hint">${stats.isEven ? 'Returns 2nd middle node' : 'Returns exact center node'}</span>
            </div>
          </div>
        </div>

        <!-- Node Row with indices -->
        <div class="single-row-canvas">
          <div class="node-sequence">
    `;

    nodes.forEach((node, idx) => {
      const isLast = idx === nodes.length - 1;
      html += `
        <div class="node-column">
          <span class="index-label">idx: ${idx}</span>
          ${this.createNodeHTML(node, idx, {
            pointers,
            highlights,
            isLast
          })}
        </div>
      `;
    });

    html += `
          </div>
        </div>

        <!-- Mathematical explanation callout -->
        <div class="math-proof-callout">
          <strong>Mathematical Invariant:</strong> At step $k$, $\\text{Fast} = 2k$ and $\\text{Slow} = k$. When $\\text{Fast} \\ge N$, $\\text{Slow} = \\lfloor N/2 \\rfloor$, exactly identifying the midpoint in a single $O(N)$ pass!
        </div>
      </div>
    `;

    this.container.innerHTML = html;
  }

  /**
   * 3. RENDER: Merge Two Sorted Lists
   */
  renderMergeTwoSorted(step) {
    const { list1, list2, mergedList, pointers, highlights } = step;

    let html = `
      <div class="merge-two-visualizer">
        <!-- Input Lists Overview -->
        <div class="two-lists-split">
          <div class="list-section">
            <div class="section-badge cyan-badge">List 1 (Sorted)</div>
            <div class="node-sequence">
              ${list1.map((node, i) => this.createNodeHTML(node, i, {
                pointers,
                highlights,
                isLast: i === list1.length - 1
              })).join("")}
            </div>
          </div>

          <div class="list-section">
            <div class="section-badge purple-badge">List 2 (Sorted)</div>
            <div class="node-sequence">
              ${list2.map((node, i) => this.createNodeHTML(node, i, {
                pointers,
                highlights,
                isLast: i === list2.length - 1
              })).join("")}
            </div>
          </div>
        </div>

        <!-- Separator / Merging direction indicator -->
        <div class="merge-action-divider">
          <span class="divider-line"></span>
          <span class="divider-text">⚡ Merging into Single Output List via Dummy Head ⚡</span>
          <span class="divider-line"></span>
        </div>

        <!-- Output Merged List -->
        <div class="merged-output-section">
          <div class="section-badge emerald-badge">Output Merged List (dummy -> sorted)</div>
          <div class="node-sequence">
            ${mergedList.map((node, i) => this.createNodeHTML(node, i, {
              pointers,
              highlights,
              isLast: i === mergedList.length - 1
            })).join("")}
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
  }

  /**
   * 4. RENDER: Reverse Linked List
   */
  renderReverseList(step) {
    const { nodes, pointers, highlights, links } = step;

    let html = `
      <div class="reverse-list-visualizer">
        <!-- Pointer Status Bar -->
        <div class="pointer-status-summary">
          <div class="status-chip purple-chip">
            <span class="chip-key">prev:</span>
            <span class="chip-val">${pointers.prev ? nodes.find(n => n.id === pointers.prev)?.val : 'NULL'}</span>
          </div>
          <div class="status-chip cyan-chip">
            <span class="chip-key">curr:</span>
            <span class="chip-val">${pointers.curr ? nodes.find(n => n.id === pointers.curr)?.val : 'NULL'}</span>
          </div>
          <div class="status-chip indigo-chip">
            <span class="chip-key">nextTemp:</span>
            <span class="chip-val">${pointers.nextTemp ? nodes.find(n => n.id === pointers.nextTemp)?.val : 'NULL'}</span>
          </div>
        </div>

        <!-- Main Dynamic Canvas -->
        <div class="single-row-canvas">
          <div class="node-sequence">
    `;

    nodes.forEach((node, idx) => {
      // Find direction of outgoing link
      let isReversed = false;
      if (idx > 0) {
        const link = links.find(l => l.fromId === nodes[idx - 1].id && l.toId === node.id);
        if (link && link.direction === "reversed") {
          isReversed = true;
        }
      }

      const isLast = idx === nodes.length - 1;

      html += `
        <div class="node-column">
          <span class="index-label">Node ${idx + 1}</span>
          ${this.createNodeHTML(node, idx, {
            pointers,
            highlights,
            isReversed,
            isLast
          })}
        </div>
      `;
    });

    html += `
          </div>
        </div>

        <!-- Reversal Legend / Explanation -->
        <div class="reversal-legend">
          <div class="legend-item"><span class="arrow-sample">→</span> Forward Connection (Original)</div>
          <div class="legend-item"><span class="arrow-sample reversed-sample">←</span> Reversed Pointer (curr->next = prev)</div>
          <div class="legend-item"><span class="node-sample-emerald"></span> Inverted & Stabilized Node</div>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
  }
}
