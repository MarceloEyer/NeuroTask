const fs = require('fs');

const file = 'src/hooks/useTasks.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /const addTask = \(formData: TaskFormData\) => \{[\s\S]*?setTasks\(\(prev\) => \[newTask, \.\.\.prev\]\);\n  \};/,
  `const addTask = (formData: TaskFormData) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: String(formData.title || ''),
      domain: formData.domain,
      impact: Math.max(1, Math.min(5, Number(formData.impact) || 1)),
      urgency: Math.max(1, Math.min(5, Number(formData.urgency) || 1)),
      emotionalCost: Math.max(1, Math.min(5, Number(formData.emotionalCost) || 1)),
      emotionalType: formData.emotionalType,
      size: formData.size,
      deadline: formData.deadline ? String(formData.deadline) : undefined,
      tags: Array.isArray(formData.tags) ? formData.tags : [],
      status: 'inbox',
      checklist: [],
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };`
);

code = code.replace(
  /const updateTask = \(id: string, updates: Partial<Task>\) => \{[\s\S]*?prev\.map\(\(task\) => \(task\.id === id \? \{ \.\.\.task, \.\.\.updates \} : task\)\)\n    \);\n  \};/,
  `const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const safeUpdates: Partial<Task> = {};
          if (updates.title !== undefined) safeUpdates.title = String(updates.title);
          if (updates.domain !== undefined) safeUpdates.domain = updates.domain;
          if (updates.impact !== undefined) safeUpdates.impact = Math.max(1, Math.min(5, Number(updates.impact) || 1));
          if (updates.urgency !== undefined) safeUpdates.urgency = Math.max(1, Math.min(5, Number(updates.urgency) || 1));
          if (updates.emotionalCost !== undefined) safeUpdates.emotionalCost = Math.max(1, Math.min(5, Number(updates.emotionalCost) || 1));
          if (updates.emotionalType !== undefined) safeUpdates.emotionalType = updates.emotionalType;
          if (updates.size !== undefined) safeUpdates.size = updates.size;
          if (updates.deadline !== undefined) safeUpdates.deadline = String(updates.deadline);
          if (updates.tags !== undefined) safeUpdates.tags = Array.isArray(updates.tags) ? updates.tags : [];

          return { ...task, ...safeUpdates };
        }
        return task;
      })
    );
  };`
);

fs.writeFileSync(file, code);
