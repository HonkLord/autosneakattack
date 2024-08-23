Hooks.on("midi-qol.RollComplete", async (workflow) => {
  // Only proceed for attack rolls that are successful and involve attacks
  if (workflow.hitTargets.size === 0 || !workflow.item.hasAttack) return;

  const actor = workflow.actor;

  // Check if the actor has the Sneak Attack feature in their inventory
  const sneakAttackItem = actor.items.find((i) => i.name === "Sneak Attack");
  if (!sneakAttackItem) {
    console.error("Sneak Attack item not found for actor", actor.name);
    return;
  }

  // Prompt the user if they want to apply sneak attack
  new Dialog({
    title: "Sneak Attack",
    content: "<p>Your attack hit. Would you like to apply Sneak Attack?</p>",
    buttons: {
      yes: {
        label: "Yes",
        callback: async () => {
          // Check if the item has a roll or use method, and execute the correct one
          if (typeof sneakAttackItem.roll === "function") {
            await sneakAttackItem.roll();
          } else if (typeof sneakAttackItem.use === "function") {
            await sneakAttackItem.use();
          } else {
            console.error(
              "Sneak Attack item has no valid roll or use method",
              sneakAttackItem
            );
          }
        },
      },
      no: {
        label: "No",
        callback: () => console.log("No Sneak Attack applied."),
      },
    },
    default: "yes",
  }).render(true);
});
