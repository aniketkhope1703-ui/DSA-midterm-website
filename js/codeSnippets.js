/* Code snippets for all 4 problems in C++, Java, and Python with line mappings */

export const CODE_DATA = {
  merge_sort: {
    title: "Merge Sort on Linked List",
    complexity: {
      time: "O(N log N)",
      space: "O(log N)",
      auxiliary: "O(log N) recursion stack space (O(1) heap)",
      stability: "Stable"
    },
    cpp: [
      /* 1 */ "ListNode* sortList(ListNode* head) {",
      /* 2 */ "    if (!head || !head->next) return head; // Base case",
      /* 3 */ "    ListNode* mid = getMidAndSplit(head);  // Split list",
      /* 4 */ "    ListNode* left = sortList(head);       // Sort left half",
      /* 5 */ "    ListNode* right = sortList(mid);       // Sort right half",
      /* 6 */ "    return merge(left, right);             // Merge two sorted halves",
      /* 7 */ "}",
      /* 8 */ "ListNode* getMidAndSplit(ListNode* head) {",
      /* 9 */ "    ListNode *slow = head, *fast = head->next;",
      /* 10*/ "    while (fast && fast->next) {",
      /* 11*/ "        slow = slow->next; fast = fast->next->next;",
      /* 12*/ "    }",
      /* 13*/ "    ListNode* mid = slow->next;",
      /* 14*/ "    slow->next = nullptr; // Disconnect left from right",
      /* 15*/ "    return mid;",
      /* 16*/ "}",
      /* 17*/ "ListNode* merge(ListNode* l1, ListNode* l2) {",
      /* 18*/ "    ListNode dummy(0); ListNode* tail = &dummy;",
      /* 19*/ "    while (l1 && l2) {",
      /* 20*/ "        if (l1->val <= l2->val) { tail->next = l1; l1 = l1->next; }",
      /* 21*/ "        else { tail->next = l2; l2 = l2->next; }",
      /* 22*/ "        tail = tail->next;",
      /* 23*/ "    }",
      /* 24*/ "    tail->next = l1 ? l1 : l2;",
      /* 25*/ "    return dummy.next;",
      /* 26*/ "}"
    ],
    java: [
      /* 1 */ "public ListNode sortList(ListNode head) {",
      /* 2 */ "    if (head == null || head.next == null) return head; // Base case",
      /* 3 */ "    ListNode mid = getMidAndSplit(head);  // Split list",
      /* 4 */ "    ListNode left = sortList(head);       // Sort left half",
      /* 5 */ "    ListNode right = sortList(mid);       // Sort right half",
      /* 6 */ "    return merge(left, right);             // Merge two sorted halves",
      /* 7 */ "}",
      /* 8 */ "private ListNode getMidAndSplit(ListNode head) {",
      /* 9 */ "    ListNode slow = head, fast = head.next;",
      /* 10*/ "    while (fast != null && fast.next != null) {",
      /* 11*/ "        slow = slow.next; fast = fast.next.next;",
      /* 12*/ "    }",
      /* 13*/ "    ListNode mid = slow.next;",
      /* 14*/ "    slow.next = null; // Sever link",
      /* 15*/ "    return mid;",
      /* 16*/ "}",
      /* 17*/ "private ListNode merge(ListNode l1, ListNode l2) {",
      /* 18*/ "    ListNode dummy = new ListNode(0); ListNode tail = dummy;",
      /* 19*/ "    while (l1 != null && l2 != null) {",
      /* 20*/ "        if (l1.val <= l2.val) { tail.next = l1; l1 = l1.next; }",
      /* 21*/ "        else { tail.next = l2; l2 = l2.next; }",
      /* 22*/ "        tail = tail.next;",
      /* 23*/ "    }",
      /* 24*/ "    tail.next = (l1 != null) ? l1 : l2;",
      /* 25*/ "    return dummy.next;",
      /* 26*/ "}"
    ],
    python: [
      /* 1 */ "def sortList(head: Optional[ListNode]) -> Optional[ListNode]:",
      /* 2 */ "    if not head or not head.next: return head # Base case",
      /* 3 */ "    mid = getMidAndSplit(head)   # Split list",
      /* 4 */ "    left = sortList(head)        # Sort left half",
      /* 5 */ "    right = sortList(mid)        # Sort right half",
      /* 6 */ "    return merge(left, right)    # Merge sorted halves",
      /* 7 */ "",
      /* 8 */ "def getMidAndSplit(head):",
      /* 9 */ "    slow, fast = head, head.next",
      /* 10*/ "    while fast and fast.next:",
      /* 11*/ "        slow = slow.next; fast = fast.next.next",
      /* 12*/ "    mid = slow.next",
      /* 13*/ "    slow.next = None # Disconnect left from right",
      /* 14*/ "    return mid",
      /* 15*/ "",
      /* 16*/ "def merge(l1, l2):",
      /* 17*/ "    dummy = ListNode(0)",
      /* 18*/ "    tail = dummy",
      /* 19*/ "    while l1 and l2:",
      /* 20*/ "        if l1.val <= l2.val: tail.next = l1; l1 = l1.next",
      /* 21*/ "        else: tail.next = l2; l2 = l2.next",
      /* 22*/ "        tail = tail.next",
      /* 23*/ "    tail.next = l1 or l2",
      /* 24*/ "    return dummy.next"
    ]
  },

  find_middle: {
    title: "Find Middle of Linked List (Tortoise & Hare)",
    complexity: {
      time: "O(N)",
      space: "O(1)",
      auxiliary: "O(1) constant pointers",
      stability: "Single Pass"
    },
    cpp: [
      /* 1 */ "ListNode* middleNode(ListNode* head) {",
      /* 2 */ "    ListNode* slow = head;",
      /* 3 */ "    ListNode* fast = head;",
      /* 4 */ "    while (fast != nullptr && fast->next != nullptr) {",
      /* 5 */ "        slow = slow->next;        // 1 step forward",
      /* 6 */ "        fast = fast->next->next;  // 2 steps forward",
      /* 7 */ "    }",
      /* 8 */ "    return slow; // When fast reaches end, slow is at mid",
      /* 9 */ "}"
    ],
    java: [
      /* 1 */ "public ListNode middleNode(ListNode head) {",
      /* 2 */ "    ListNode slow = head;",
      /* 3 */ "    ListNode fast = head;",
      /* 4 */ "    while (fast != null && fast.next != null) {",
      /* 5 */ "        slow = slow.next;        // 1 step forward",
      /* 6 */ "        fast = fast.next.next;  // 2 steps forward",
      /* 7 */ "    }",
      /* 8 */ "    return slow; // Tortoise is exactly in the center",
      /* 9 */ "}"
    ],
    python: [
      /* 1 */ "def middleNode(head: Optional[ListNode]) -> Optional[ListNode]:",
      /* 2 */ "    slow = head",
      /* 3 */ "    fast = head",
      /* 4 */ "    while fast and fast.next:",
      /* 5 */ "        slow = slow.next        # Advances 1 node",
      /* 6 */ "        fast = fast.next.next   # Advances 2 nodes",
      /* 7 */ "    return slow                 # Fast reached end; slow is at midpoint"
    ]
  },

  merge_two_sorted: {
    title: "Merge Two Sorted Linked Lists",
    complexity: {
      time: "O(N + M)",
      space: "O(1)",
      auxiliary: "In-place pointer rewiring (Iterative)",
      stability: "Preserves duplicate order"
    },
    cpp: [
      /* 1 */ "ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {",
      /* 2 */ "    ListNode dummy(0);",
      /* 3 */ "    ListNode* tail = &dummy;",
      /* 4 */ "    while (l1 && l2) {",
      /* 5 */ "        if (l1->val <= l2->val) {",
      /* 6 */ "            tail->next = l1;",
      /* 7 */ "            l1 = l1->next;",
      /* 8 */ "        } else {",
      /* 9 */ "            tail->next = l2;",
      /* 10*/ "            l2 = l2->next;",
      /* 11*/ "        }",
      /* 12*/ "        tail = tail->next;",
      /* 13*/ "    }",
      /* 14*/ "    tail->next = l1 ? l1 : l2; // Attach remaining elements",
      /* 15*/ "    return dummy.next;",
      /* 16*/ "}"
    ],
    java: [
      /* 1 */ "public ListNode mergeTwoLists(ListNode l1, ListNode l2) {",
      /* 2 */ "    ListNode dummy = new ListNode(0);",
      /* 3 */ "    ListNode tail = dummy;",
      /* 4 */ "    while (l1 != null && l2 != null) {",
      /* 5 */ "        if (l1.val <= l2.val) {",
      /* 6 */ "            tail.next = l1;",
      /* 7 */ "            l1 = l1.next;",
      /* 8 */ "        } else {",
      /* 9 */ "            tail.next = l2;",
      /* 10*/ "            l2 = l2.next;",
      /* 11*/ "        }",
      /* 12*/ "        tail = tail.next;",
      /* 13*/ "    }",
      /* 14*/ "    tail.next = (l1 != null) ? l1 : l2;",
      /* 15*/ "    return dummy.next;",
      /* 16*/ "}"
    ],
    python: [
      /* 1 */ "def mergeTwoLists(l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:",
      /* 2 */ "    dummy = ListNode(0)",
      /* 3 */ "    tail = dummy",
      /* 4 */ "    while l1 and l2:",
      /* 5 */ "        if l1.val <= l2.val:",
      /* 6 */ "            tail.next = l1; l1 = l1.next",
      /* 7 */ "        else:",
      /* 8 */ "            tail.next = l2; l2 = l2.next",
      /* 9 */ "        tail = tail.next",
      /* 10*/ "    tail.next = l1 or l2 # Append remainder directly",
      /* 11*/ "    return dummy.next"
    ]
  },

  reverse_list: {
    title: "Reverse Linked List (Iterative & Pointer Rewiring)",
    complexity: {
      time: "O(N)",
      space: "O(1)",
      auxiliary: "Three sliding pointers (prev, curr, next)",
      stability: "In-place reversal"
    },
    cpp: [
      /* 1 */ "ListNode* reverseList(ListNode* head) {",
      /* 2 */ "    ListNode* prev = nullptr;",
      /* 3 */ "    ListNode* curr = head;",
      /* 4 */ "    while (curr != nullptr) {",
      /* 5 */ "        ListNode* nextTemp = curr->next; // 1. Save next",
      /* 6 */ "        curr->next = prev;               // 2. Reverse pointer",
      /* 7 */ "        prev = curr;                     // 3. Move prev forward",
      /* 8 */ "        curr = nextTemp;                 // 4. Move curr forward",
      /* 9 */ "    }",
      /* 10*/ "    return prev; // New head of reversed list",
      /* 11*/ "}"
    ],
    java: [
      /* 1 */ "public ListNode reverseList(ListNode head) {",
      /* 2 */ "    ListNode prev = null;",
      /* 3 */ "    ListNode curr = head;",
      /* 4 */ "    while (curr != null) {",
      /* 5 */ "        ListNode nextTemp = curr.next; // Store forward link",
      /* 6 */ "        curr.next = prev;              // Flip pointer backward",
      /* 7 */ "        prev = curr;                   // Advance prev",
      /* 8 */ "        curr = nextTemp;               // Advance curr",
      /* 9 */ "    }",
      /* 10*/ "    return prev;",
      /* 11*/ "}"
    ],
    python: [
      /* 1 */ "def reverseList(head: Optional[ListNode]) -> Optional[ListNode]:",
      /* 2 */ "    prev = None",
      /* 3 */ "    curr = head",
      /* 4 */ "    while curr:",
      /* 5 */ "        next_temp = curr.next  # Save next node",
      /* 6 */ "        curr.next = prev       # Reverse arrow",
      /* 7 */ "        prev = curr            # Advance prev",
      /* 8 */ "        curr = next_temp       # Advance curr",
      /* 9 */ "    return prev               # New head"
    ]
  }
};
