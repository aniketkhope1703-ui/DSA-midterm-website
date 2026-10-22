# ⚡ SortFlow — Linked List Merge Sort & Algorithm Studio

An interactive, visual educational web platform designed to teach **Merge Sort on Linked Lists** alongside core linked list algorithmic paradigms: **Floyd's Tortoise & Hare (Find Middle)**, **Merge Two Sorted Lists**, and **In-Place Linked List Reversal**.

![SortFlow Preview](https://img.shields.io/badge/Algorithms-Merge_Sort_%7C_Slow_Fast_Pointers-blue?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-Vanilla_HTML5_%7C_CSS3_%7C_JavaScript-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)

---

## 🌟 Key Highlights

- **Visual Merge Sort Breakdown**:
  - Step-by-step **Divide**: Tortoise & Hare finding midpoints and severing pointer links (`✂️ next = NULL`).
  - **Conquer & Base Cases**: Highlighting sub-lists of size 1 or empty lists.
  - **Merge**: Comparing node values across sorted sub-lists and stitching them in $O(1)$ auxiliary pointer space.
- **Code-Visualizer Synchronization**:
  - Live syntax-highlighted code in **C++**, **Java**, and **Python**.
  - Synchronous active line highlighting that steps forward alongside the visual animation.
- **Bonus Problems**:
  1. **Find Middle of Linked List**: Tortoise (🐢) & Hare (🐇) pointer walk with iteration metrics and odd/even list analysis.
  2. **Merge Two Sorted Lists**: Visualizing dummy head pointer technique and $O(1)$ remainder splicing.
  3. **Reverse Linked List**: 3-pointer sliding window (`prev`, `curr`, `nextTemp`) reversing directional arrows in-place.
- **Interactive Controls**:
  - Play / Pause, Step Forward, Step Backward, Timeline Scrubber, Speed Multiplier ($0.5\times$ to $3\times$).
  - Custom node array input (e.g. `4, 2, 1, 3`) and Randomize generator.
- **Theme & Aesthetics**:
  - Developer-centric Dark & Light mode toggle.
  - Glassmorphism UI containers and responsive layout.

---

## 🚀 Getting Started

No build tools or heavy dependencies required! Simply clone and run with any lightweight HTTP server or open `index.html`.

### Run Locally

```bash
# Clone the repository
git clone https://github.com/aniketkhope1703-ui/SortFlow-LinkedList-Visualizer.git

# Navigate into the folder
cd SortFlow-LinkedList-Visualizer

# Start local server (Python 3)
python -m http.server 8000
```

Open your browser at `http://localhost:8000` to interact with the studio.

---

## 📁 Project Structure

```text
├── index.html          # Semantic HTML5 layout with split dual-pane workspace
├── styles.css          # Design system, themes, glassmorphism, node animations
├── js/
│   ├── algorithms.js   # Step-by-step generators for Merge Sort, Midpoint, Merge, Reversal
│   ├── codeSnippets.js # C++, Java, and Python implementations with line mappings
│   ├── visualizer.js   # SVG renderer for nodes, pointer badges, and recursion levels
│   └── app.js          # State management, playback loop, and event handling
└── README.md
```

---

## 🧠 Complexity Summary

| Algorithm | Time Complexity | Space Complexity | Key Technique |
| :--- | :--- | :--- | :--- |
| **Merge Sort (Linked List)** | $O(N \log N)$ | $O(\log N)$ stack | Divide & Conquer + $O(1)$ pointer rewiring |
| **Find Middle Node** | $O(N)$ | $O(1)$ | Floyd's Fast & Slow Pointers |
| **Merge Two Sorted Lists** | $O(N + M)$ | $O(1)$ | Dummy Head Pointer |
| **Reverse Linked List** | $O(N)$ | $O(1)$ | 3 Sliding Pointers (`prev`, `curr`, `next`) |

---

## 📄 License

This project is licensed under the MIT License.
