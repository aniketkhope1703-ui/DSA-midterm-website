/* Step-by-step algorithm step generators for Linked List visualizers */

// Helper to create node objects with persistent IDs
export function createNodeList(arr, prefix = "node") {
  return arr.map((val, idx) => ({
    id: `${prefix}_${idx}_${val}_${Math.random().toString(36).substr(2, 4)}`,
    val: Number(val),
    originalIndex: idx
  }));
}

/**
 * GENERATOR: Merge Sort on Linked List
 * Tracks recursive tree, sublists, tortoise & hare midpoint discovery, splitting, and merging.
 */
export function generateMergeSortSteps(initialValues) {
  const steps = [];
  const nodes = createNodeList(initialValues, "ms");
  let stepCounter = 0;

  // Global visual tree structure tracking
  let treeLevels = []; // Array of levels, each level has sublists
  // Initial level
  treeLevels.push([{
    id: "sub_root",
    level: 0,
    nodes: [...nodes],
    status: "active" // active, splitting, merging, sorted
  }]);

  function cloneTree() {
    return JSON.parse(JSON.stringify(treeLevels));
  }

  function addStep({
    stage,
    explanation,
    codeLines,
    activeSublistId,
    pointers = {},
    highlights = {},
    cutLink = null,
    treeSnapshot = null,
    callStack = [],
    activeNodes = []
  }) {
    steps.push({
      stepId: stepCounter++,
      stage,
      explanation,
      codeLines: codeLines || { cpp: 1, java: 1, python: 1 },
      activeSublistId,
      pointers,
      highlights,
      cutLink,
      tree: treeSnapshot ? JSON.parse(JSON.stringify(treeSnapshot)) : cloneTree(),
      callStack: [...callStack],
      activeNodes
    });
  }

  // Initial Step
  addStep({
    stage: "init",
    explanation: `Starting Merge Sort on Linked List with ${nodes.length} elements: [${nodes.map(n => n.val).join(" -> ")}].`,
    codeLines: { cpp: 1, java: 1, python: 1 },
    activeSublistId: "sub_root",
    pointers: { head: nodes[0]?.id },
    callStack: [`sortList([${nodes.map(n => n.val).join(",")}])`],
    activeNodes: nodes.map(n => n.id)
  });

  // Recursive Merge Sort Function
  function recursiveSort(sublistNodes, level, parentId, pathName, stack) {
    const subId = `sub_${level}_${pathName}`;
    const currentStack = [...stack, `sortList([${sublistNodes.map(n => n.val).join(",")}])`];

    // Base case: 0 or 1 node
    if (sublistNodes.length <= 1) {
      addStep({
        stage: "base_case",
        explanation: sublistNodes.length === 1 
          ? `Base Case reached: Sub-list [${sublistNodes[0].val}] has only 1 node. A single node is already sorted!`
          : `Base Case reached: Empty sub-list is trivially sorted.`,
        codeLines: { cpp: 2, java: 2, python: 2 },
        activeSublistId: subId,
        pointers: sublistNodes.length ? { head: sublistNodes[0].id } : {},
        highlights: sublistNodes.length ? { [sublistNodes[0].id]: "node-emerald" } : {},
        callStack: currentStack,
        activeNodes: sublistNodes.map(n => n.id)
      });
      return [...sublistNodes];
    }

    // Step: Finding Mid using Tortoise and Hare
    addStep({
      stage: "find_mid_init",
      explanation: `Calling getMidAndSplit() to divide [${sublistNodes.map(n => n.val).join(" -> ")}] using Tortoise (slow) & Hare (fast) pointers.`,
      codeLines: { cpp: 3, java: 3, python: 3 },
      activeSublistId: subId,
      pointers: {
        slow: sublistNodes[0].id,
        fast: sublistNodes[1]?.id || sublistNodes[0].id,
        head: sublistNodes[0].id
      },
      highlights: {
        [sublistNodes[0].id]: "node-cyan",
        [sublistNodes[1]?.id || sublistNodes[0].id]: "node-indigo"
      },
      callStack: [...currentStack, "getMidAndSplit()"],
      activeNodes: sublistNodes.map(n => n.id)
    });

    // Tortoise and Hare iterations
    let slowIdx = 0;
    let fastIdx = 1;

    while (fastIdx < sublistNodes.length && fastIdx + 1 < sublistNodes.length) {
      slowIdx += 1;
      fastIdx += 2;
      addStep({
        stage: "find_mid_step",
        explanation: `Advancing pointers: Slow moves 1 node to [${sublistNodes[slowIdx].val}], Fast moves 2 nodes to [${fastIdx < sublistNodes.length ? sublistNodes[fastIdx].val : 'NULL'}].`,
        codeLines: { cpp: 11, java: 11, python: 11 },
        activeSublistId: subId,
        pointers: {
          slow: sublistNodes[slowIdx].id,
          fast: fastIdx < sublistNodes.length ? sublistNodes[fastIdx].id : null,
          head: sublistNodes[0].id
        },
        highlights: {
          [sublistNodes[slowIdx].id]: "node-cyan",
          ...(fastIdx < sublistNodes.length ? { [sublistNodes[fastIdx].id]: "node-indigo" } : {})
        },
        callStack: [...currentStack, "getMidAndSplit()"],
        activeNodes: sublistNodes.map(n => n.id)
      });
    }

    const midIdx = slowIdx + 1;
    const midNode = sublistNodes[midIdx];
    const slowNode = sublistNodes[slowIdx];

    // Severing the connection
    addStep({
      stage: "split_sever",
      explanation: `Midpoint located at node [${midNode.val}]. Severing connection: slow->next = NULL (break between [${slowNode.val}] and [${midNode.val}]).`,
      codeLines: { cpp: 14, java: 14, python: 13 },
      activeSublistId: subId,
      pointers: {
        slow: slowNode.id,
        mid: midNode.id
      },
      highlights: {
        [slowNode.id]: "node-crimson",
        [midNode.id]: "node-indigo"
      },
      cutLink: { fromId: slowNode.id, toId: midNode.id },
      callStack: [...currentStack, "getMidAndSplit()"],
      activeNodes: sublistNodes.map(n => n.id)
    });

    const leftHalf = sublistNodes.slice(0, midIdx);
    const rightHalf = sublistNodes.slice(midIdx);

    // Update visual tree levels for sublists
    const nextLevel = level + 1;
    if (!treeLevels[nextLevel]) treeLevels[nextLevel] = [];
    const leftSubId = `sub_${nextLevel}_${pathName}L`;
    const rightSubId = `sub_${nextLevel}_${pathName}R`;

    treeLevels[nextLevel].push({
      id: leftSubId,
      level: nextLevel,
      nodes: [...leftHalf],
      status: "active"
    });
    treeLevels[nextLevel].push({
      id: rightSubId,
      level: nextLevel,
      nodes: [...rightHalf],
      status: "active"
    });

    addStep({
      stage: "split_complete",
      explanation: `List split into Left Half [${leftHalf.map(n => n.val).join(" -> ")}] and Right Half [${rightHalf.map(n => n.val).join(" -> ")}].`,
      codeLines: { cpp: 4, java: 4, python: 4 },
      activeSublistId: leftSubId,
      pointers: {
        left: leftHalf[0].id,
        right: rightHalf[0].id
      },
      callStack: currentStack,
      activeNodes: [...leftHalf, ...rightHalf].map(n => n.id)
    });

    // Recursively sort left half
    const sortedLeft = recursiveSort(leftHalf, nextLevel, subId, `${pathName}L`, currentStack);

    // Recursively sort right half
    addStep({
      stage: "sort_right_start",
      explanation: `Now sorting Right Half [${rightHalf.map(n => n.val).join(" -> ")}].`,
      codeLines: { cpp: 5, java: 5, python: 5 },
      activeSublistId: rightSubId,
      pointers: { right: rightHalf[0].id },
      callStack: currentStack,
      activeNodes: rightHalf.map(n => n.id)
    });
    const sortedRight = recursiveSort(rightHalf, nextLevel, subId, `${pathName}R`, currentStack);

    // Merge Step
    addStep({
      stage: "merge_start",
      explanation: `Merging two sorted sub-lists: Left [${sortedLeft.map(n => n.val).join(", ")}] and Right [${sortedRight.map(n => n.val).join(", ")}].`,
      codeLines: { cpp: 6, java: 6, python: 6 },
      activeSublistId: subId,
      pointers: {
        l1: sortedLeft[0]?.id,
        l2: sortedRight[0]?.id
      },
      highlights: {
        [sortedLeft[0]?.id]: "node-cyan",
        [sortedRight[0]?.id]: "node-indigo"
      },
      callStack: [...currentStack, "merge(left, right)"],
      activeNodes: [...sortedLeft, ...sortedRight].map(n => n.id)
    });

    // Merging pointers logic
    let i = 0, j = 0;
    const merged = [];

    while (i < sortedLeft.length && j < sortedRight.length) {
      const nodeL = sortedLeft[i];
      const nodeR = sortedRight[j];

      if (nodeL.val <= nodeR.val) {
        addStep({
          stage: "merge_compare",
          explanation: `Compare: ${nodeL.val} <= ${nodeR.val}. Left element [${nodeL.val}] is smaller or equal -> Append [${nodeL.val}] to merged list.`,
          codeLines: { cpp: 20, java: 20, python: 20 },
          activeSublistId: subId,
          pointers: { l1: nodeL.id, l2: nodeR.id },
          highlights: { [nodeL.id]: "node-emerald", [nodeR.id]: "node-crimson" },
          callStack: [...currentStack, "merge(left, right)"],
          activeNodes: [...merged, nodeL].map(n => n.id)
        });
        merged.push(nodeL);
        i++;
      } else {
        addStep({
          stage: "merge_compare",
          explanation: `Compare: ${nodeL.val} > ${nodeR.val}. Right element [${nodeR.val}] is smaller -> Append [${nodeR.val}] to merged list.`,
          codeLines: { cpp: 21, java: 21, python: 21 },
          activeSublistId: subId,
          pointers: { l1: nodeL.id, l2: nodeR.id },
          highlights: { [nodeR.id]: "node-emerald", [nodeL.id]: "node-crimson" },
          callStack: [...currentStack, "merge(left, right)"],
          activeNodes: [...merged, nodeR].map(n => n.id)
        });
        merged.push(nodeR);
        j++;
      }
    }

    // Append remainder
    while (i < sortedLeft.length) {
      const nodeL = sortedLeft[i];
      merged.push(nodeL);
      i++;
    }
    while (j < sortedRight.length) {
      const nodeR = sortedRight[j];
      merged.push(nodeR);
      j++;
    }

    addStep({
      stage: "merge_complete",
      explanation: `Merged sub-lists successfully into: [${merged.map(n => n.val).join(" -> ")}].`,
      codeLines: { cpp: 25, java: 25, python: 24 },
      activeSublistId: subId,
      pointers: { head: merged[0].id },
      highlights: merged.reduce((acc, n) => ({ ...acc, [n.id]: "node-emerald" }), {}),
      callStack: currentStack,
      activeNodes: merged.map(n => n.id)
    });

    return merged;
  }

  const finalSorted = recursiveSort(nodes, 0, "root", "R", []);

  // Final step
  addStep({
    stage: "sorted_final",
    explanation: `🎉 Linked List is fully sorted in O(N log N) time! Result: [${finalSorted.map(n => n.val).join(" -> ")} -> NULL].`,
    codeLines: { cpp: 6, java: 6, python: 6 },
    activeSublistId: "sub_root",
    pointers: { head: finalSorted[0]?.id },
    highlights: finalSorted.reduce((acc, n) => ({ ...acc, [n.id]: "node-emerald" }), {}),
    callStack: ["Complete"],
    activeNodes: finalSorted.map(n => n.id)
  });

  return steps;
}

/**
 * GENERATOR: Find Middle of Linked List (Tortoise and Hare)
 */
export function generateFindMiddleSteps(initialValues) {
  const steps = [];
  const nodes = createNodeList(initialValues, "mid");
  let stepCounter = 0;

  function addStep({
    stage,
    explanation,
    codeLines,
    pointers = {},
    highlights = {},
    stats = {}
  }) {
    steps.push({
      stepId: stepCounter++,
      stage,
      explanation,
      codeLines: codeLines || { cpp: 1, java: 1, python: 1 },
      pointers,
      highlights,
      nodes: [...nodes],
      stats: {
        isEven: nodes.length % 2 === 0,
        totalLength: nodes.length,
        ...stats
      }
    });
  }

  // Step 1: Initial
  addStep({
    stage: "init",
    explanation: `List has ${nodes.length} nodes (${nodes.length % 2 === 0 ? 'Even' : 'Odd'} count). Initialize both 'slow' (tortoise) and 'fast' (hare) at head [${nodes[0]?.val}].`,
    codeLines: { cpp: 2, java: 2, python: 2 },
    pointers: { slow: nodes[0]?.id, fast: nodes[0]?.id, head: nodes[0]?.id },
    highlights: { [nodes[0]?.id]: "node-cyan" },
    stats: { slowIndex: 0, fastIndex: 0, loopCount: 0 }
  });

  let slowIdx = 0;
  let fastIdx = 0;
  let loopCount = 0;

  while (fastIdx < nodes.length && fastIdx + 1 < nodes.length) {
    loopCount++;
    // Check condition
    addStep({
      stage: "loop_condition_true",
      explanation: `Iteration ${loopCount}: fast (${fastIdx}) and fast->next (${fastIdx + 1}) exist. Condition holds.`,
      codeLines: { cpp: 4, java: 4, python: 4 },
      pointers: { slow: nodes[slowIdx].id, fast: nodes[fastIdx].id },
      highlights: { [nodes[slowIdx].id]: "node-cyan", [nodes[fastIdx].id]: "node-indigo" },
      stats: { slowIndex: slowIdx, fastIndex: fastIdx, loopCount }
    });

    slowIdx += 1;
    fastIdx += 2;

    addStep({
      stage: "pointers_advanced",
      explanation: `Advance pointers: Slow moves 1 step to index ${slowIdx} (val: ${nodes[slowIdx].val}), Fast moves 2 steps to ${fastIdx < nodes.length ? `index ${fastIdx} (val: ${nodes[fastIdx].val})` : 'NULL'}.`,
      codeLines: { cpp: 6, java: 6, python: 6 },
      pointers: {
        slow: nodes[slowIdx].id,
        fast: fastIdx < nodes.length ? nodes[fastIdx].id : null
      },
      highlights: {
        [nodes[slowIdx].id]: "node-cyan",
        ...(fastIdx < nodes.length ? { [nodes[fastIdx].id]: "node-indigo" } : {})
      },
      stats: { slowIndex: slowIdx, fastIndex: fastIdx, loopCount }
    });
  }

  // Final check
  addStep({
    stage: "loop_exit",
    explanation: `Loop terminates! Fast reached ${fastIdx >= nodes.length ? 'the end (NULL)' : `the last node (val: ${nodes[fastIdx].val})`}. Slow is stationed at index ${slowIdx} (value: ${nodes[slowIdx].val}).`,
    codeLines: { cpp: 8, java: 8, python: 7 },
    pointers: {
      slow: nodes[slowIdx].id,
      fast: fastIdx < nodes.length ? nodes[fastIdx].id : null,
      mid: nodes[slowIdx].id
    },
    highlights: { [nodes[slowIdx].id]: "node-emerald" },
    stats: { slowIndex: slowIdx, fastIndex: fastIdx, loopCount, midNodeVal: nodes[slowIdx].val }
  });

  return steps;
}

/**
 * GENERATOR: Merge Two Sorted Lists
 */
export function generateMergeTwoSortedSteps(arr1Values, arr2Values) {
  const steps = [];
  const list1 = createNodeList(arr1Values.sort((a,b) => a - b), "l1");
  const list2 = createNodeList(arr2Values.sort((a,b) => a - b), "l2");
  const dummyNode = { id: "node_dummy", val: "0", isDummy: true };
  let stepCounter = 0;

  let mergedList = [dummyNode];

  function addStep({
    stage,
    explanation,
    codeLines,
    pointers = {},
    highlights = {}
  }) {
    steps.push({
      stepId: stepCounter++,
      stage,
      explanation,
      codeLines: codeLines || { cpp: 1, java: 1, python: 1 },
      pointers,
      highlights,
      list1: JSON.parse(JSON.stringify(list1)),
      list2: JSON.parse(JSON.stringify(list2)),
      mergedList: JSON.parse(JSON.stringify(mergedList))
    });
  }

  // Initial step
  addStep({
    stage: "init",
    explanation: `Initialize dummy node and set tail pointer to dummy. l1 points to head of List 1 (${list1[0]?.val}), l2 points to head of List 2 (${list2[0]?.val}).`,
    codeLines: { cpp: 3, java: 3, python: 3 },
    pointers: {
      dummy: dummyNode.id,
      tail: dummyNode.id,
      l1: list1[0]?.id,
      l2: list2[0]?.id
    },
    highlights: {
      [dummyNode.id]: "node-indigo",
      [list1[0]?.id]: "node-cyan",
      [list2[0]?.id]: "node-purple"
    }
  });

  let p1 = 0;
  let p2 = 0;

  while (p1 < list1.length && p2 < list2.length) {
    const node1 = list1[p1];
    const node2 = list2[p2];

    addStep({
      stage: "compare",
      explanation: `Comparing current nodes: l1 (${node1.val}) vs l2 (${node2.val}).`,
      codeLines: { cpp: 5, java: 5, python: 5 },
      pointers: {
        tail: mergedList[mergedList.length - 1].id,
        l1: node1.id,
        l2: node2.id
      },
      highlights: {
        [node1.id]: node1.val <= node2.val ? "node-emerald" : "node-crimson",
        [node2.id]: node2.val < node1.val ? "node-emerald" : "node-crimson"
      }
    });

    if (node1.val <= node2.val) {
      mergedList.push({ ...node1 });
      p1++;
      addStep({
        stage: "append_l1",
        explanation: `${node1.val} <= ${node2.val}. Linking tail->next = l1 (${node1.val}). Advance l1 pointer and tail.`,
        codeLines: { cpp: 7, java: 7, python: 6 },
        pointers: {
          tail: node1.id,
          l1: p1 < list1.length ? list1[p1].id : null,
          l2: node2.id
        },
        highlights: { [node1.id]: "node-emerald" }
      });
    } else {
      mergedList.push({ ...node2 });
      p2++;
      addStep({
        stage: "append_l2",
        explanation: `${node2.val} < ${node1.val}. Linking tail->next = l2 (${node2.val}). Advance l2 pointer and tail.`,
        codeLines: { cpp: 10, java: 10, python: 8 },
        pointers: {
          tail: node2.id,
          l1: node1.id,
          l2: p2 < list2.length ? list2[p2].id : null
        },
        highlights: { [node2.id]: "node-emerald" }
      });
    }
  }

  // Remainder
  if (p1 < list1.length) {
    const rem = list1.slice(p1);
    mergedList.push(...rem);
    addStep({
      stage: "append_remainder_l1",
      explanation: `List 2 is exhausted. Attaching remaining nodes of List 1 ([${rem.map(n => n.val).join(", ")}]) directly in O(1) time.`,
      codeLines: { cpp: 14, java: 14, python: 10 },
      pointers: { tail: rem[rem.length - 1].id },
      highlights: rem.reduce((acc, n) => ({ ...acc, [n.id]: "node-emerald" }), {})
    });
  } else if (p2 < list2.length) {
    const rem = list2.slice(p2);
    mergedList.push(...rem);
    addStep({
      stage: "append_remainder_l2",
      explanation: `List 1 is exhausted. Attaching remaining nodes of List 2 ([${rem.map(n => n.val).join(", ")}]) directly in O(1) time.`,
      codeLines: { cpp: 14, java: 14, python: 10 },
      pointers: { tail: rem[rem.length - 1].id },
      highlights: rem.reduce((acc, n) => ({ ...acc, [n.id]: "node-emerald" }), {})
    });
  }

  // Done
  addStep({
    stage: "merge_finished",
    explanation: `Merge complete! Return dummy.next as new head ([${mergedList.slice(1).map(n => n.val).join(" -> ")} -> NULL]).`,
    codeLines: { cpp: 15, java: 15, python: 11 },
    pointers: { head: mergedList[1]?.id },
    highlights: mergedList.slice(1).reduce((acc, n) => ({ ...acc, [n.id]: "node-emerald" }), {})
  });

  return steps;
}

/**
 * GENERATOR: Reverse Linked List (Iterative & Pointer Rewiring)
 */
export function generateReverseListSteps(initialValues) {
  const steps = [];
  const nodes = createNodeList(initialValues, "rev");
  let stepCounter = 0;

  // Arrow connections tracking: [ { fromId, toId, direction: 'forward' | 'reversed' | 'severed' } ]
  let links = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    links.push({
      fromId: nodes[i].id,
      toId: nodes[i + 1].id,
      direction: "forward"
    });
  }

  function cloneLinks() {
    return JSON.parse(JSON.stringify(links));
  }

  function addStep({
    stage,
    explanation,
    codeLines,
    pointers = {},
    highlights = {},
    linksSnapshot = null
  }) {
    steps.push({
      stepId: stepCounter++,
      stage,
      explanation,
      codeLines: codeLines || { cpp: 1, java: 1, python: 1 },
      pointers,
      highlights,
      nodes: [...nodes],
      links: linksSnapshot ? JSON.parse(JSON.stringify(linksSnapshot)) : cloneLinks()
    });
  }

  // Initial
  addStep({
    stage: "init",
    explanation: `Initialize 'prev = NULL' and 'curr = head' ([${nodes[0]?.val}]). We will iterate through nodes and reverse directional pointers in-place.`,
    codeLines: { cpp: 3, java: 3, python: 3 },
    pointers: { prev: null, curr: nodes[0]?.id },
    highlights: { [nodes[0]?.id]: "node-cyan" }
  });

  let prevId = null;
  let currIdx = 0;

  while (currIdx < nodes.length) {
    const currNode = nodes[currIdx];
    const nextNode = currIdx + 1 < nodes.length ? nodes[currIdx + 1] : null;

    // Step 1: Save nextTemp = curr->next
    addStep({
      stage: "save_next",
      explanation: `Step 1: Save next pointer (nextTemp = [${nextNode ? nextNode.val : 'NULL'}]) before severing connection.`,
      codeLines: { cpp: 5, java: 5, python: 5 },
      pointers: {
        prev: prevId,
        curr: currNode.id,
        nextTemp: nextNode ? nextNode.id : null
      },
      highlights: {
        [currNode.id]: "node-cyan",
        ...(nextNode ? { [nextNode.id]: "node-indigo" } : {})
      }
    });

    // Step 2: Reverse pointer curr->next = prev
    if (currIdx > 0) {
      const link = links.find(l => l.fromId === nodes[currIdx - 1].id && l.toId === currNode.id);
      if (link) link.direction = "reversed";
    }

    addStep({
      stage: "reverse_pointer",
      explanation: `Step 2: Reverse direction! Set curr->next = prev (${prevId ? `[${nodes[currIdx - 1].val}]` : 'NULL'}). The arrow now points backward.`,
      codeLines: { cpp: 6, java: 6, python: 6 },
      pointers: {
        prev: prevId,
        curr: currNode.id,
        nextTemp: nextNode ? nextNode.id : null
      },
      highlights: {
        [currNode.id]: "node-emerald",
        ...(prevId ? { [prevId]: "node-emerald" } : {})
      }
    });

    // Step 3 & 4: Advance prev and curr
    prevId = currNode.id;
    currIdx++;

    addStep({
      stage: "advance_pointers",
      explanation: `Steps 3 & 4: Advance 'prev' to [${currNode.val}], and 'curr' to [${nextNode ? nextNode.val : 'NULL'}].`,
      codeLines: { cpp: 8, java: 8, python: 8 },
      pointers: {
        prev: prevId,
        curr: nextNode ? nextNode.id : null
      },
      highlights: {
        [prevId]: "node-emerald",
        ...(nextNode ? { [nextNode.id]: "node-cyan" } : {})
      }
    });
  }

  // Done
  addStep({
    stage: "reversed_complete",
    explanation: `🎉 Reversal complete! 'curr' reached NULL. 'prev' is the new head: [${nodes.slice().reverse().map(n => n.val).join(" -> ")} -> NULL].`,
    codeLines: { cpp: 10, java: 10, python: 9 },
    pointers: { head: prevId },
    highlights: nodes.reduce((acc, n) => ({ ...acc, [n.id]: "node-emerald" }), {})
  });

  return steps;
}
