const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const facID = "95"; // update when N-Day starts!

document.addEventListener("keydown", (e) => {
  // Stops the spacebar from scrolling
  if (e.code === "Space" && e.target === document.body) {
    e.preventDefault();
    e.stopPropagation();
  }
});

document.addEventListener("keyup", handleKeyUp);

let disabled = false;

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    disabled = false;
  }
});

function handleKeyUp(e: KeyboardEvent) {
  if (disabled) {
    return;
  }

  if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) {
    return;
  }

  if (
    document.activeElement?.tagName === "INPUT" ||
    document.activeElement?.tagName === "SELECT" ||
    document.activeElement?.tagName === "TEXTAREA"
  ) {
    return;
  }

  // Go Back (,)
  if (e.code === "Comma") {
    history.back();
  }
  // Refresh (N)
  else if (e.code === "KeyN") {
    location.reload();
  }
  // Page listing all factions (F)
  else if (e.code === "KeyF") {
    assign("/page=factions");
  }
  // Convert Production (P, P)
  else if (e.code === "KeyP") {
    if (
      location.href.includes("page=nukes") &&
      location.href.includes("view=production") &&
      (location.href.includes(`nation=${document.body.dataset.nname}`) ||
        !location.href.includes("/nation="))
    ) {
      if ($("span.fancylike")?.textContent?.includes("Military")) {
        $<HTMLButtonElement>(
          '.button[name="convertproduction"][value^="nukes"]'
        )?.click();
      } else if ($("span.fancylike")?.textContent?.includes("Strategic")) {
        $<HTMLButtonElement>(
          '.button[name="convertproduction"][value^="shield"]'
        )?.click();
      } else if ($("span.fancylike")?.textContent?.includes("Economic")) {
        $<HTMLButtonElement>(
          '.button[name="convertproduction"][value^="shield"]'
        )?.click();
      } else if ($("span.fancylike")?.textContent?.includes("Intel")) {
        $<HTMLButtonElement>(
          '.button[name="convertproduction"][value^="shield"]'
        )?.click();
      }
    } else {
      assign("/page=nukes/view=production");
    }
  }
  // Convert Production to Nukes (W, W)
  else if (e.code === "KeyW") {
    if (
      location.href.includes("view=production") &&
      location.href.includes("page=nukes") &&
      (location.href.includes("nation=" + document.body.dataset.nname) ||
        !location.href.includes("/nation="))
    ) {
      $<HTMLButtonElement>(
        '.button[name="convertproduction"][value^="nukes"]'
      )?.click();
    } else {
      assign("/page=nukes/view=production");
    }
  }
  // Convert Production to Shields (S, S)
  else if (e.code === "KeyS") {
    if (
      location.href.includes("view=production") &&
      location.href.includes("page=nukes") &&
      (location.href.includes(`nation=${document.body.dataset.nname}`) ||
        !location.href.includes("/nation="))
    ) {
      $<HTMLButtonElement>(
        '.button[name="convertproduction"][value^="shield"]'
      )?.click();
    } else {
      assign("/page=nukes/view=production");
    }
  }
  // Your Nukes, Your Faction (Spacebar, Spacebar)
  else if (e.code === "Space" && e.target === document.body) {
    if (
      location.href.includes("page=nukes") &&
      !location.href.includes("/view=") &&
      (location.href.includes(`nation=${document.body.dataset.nname}`) ||
        !location.href.includes("/nation="))
    ) {
      assign(`/page=faction/fid=${facID}`);
    } else {
      assign("/page=nukes");
    }
  }
  // View and Shield Incoming (M, M)
  else if (e.code === "KeyM") {
    // if we're on the incoming nukes page
    if (location.href.includes(`fid=${facID}/view=incoming`)) {
      // shield a random incoming set in the list
      if ($$('.button[name="defend"]').length > 0) {
        $$<HTMLButtonElement>('.button[name="defend"]')[
          Math.floor(Math.random() * $$('.button[name="defend"]').length)
        ]?.click();
        // any additional code if there's a captcha/additional choice?
      } else if ($('a[href*="view=incoming?start="]')) {
        $<HTMLAnchorElement>('a[href*="view=incoming?start="]')?.click();
      }
      // reload the page to check for new incoming nukes
      else {
        assign(`/page=faction/fid=${facID}/view=incoming`);
      }
    }
    // if we're not on the incoming nukes page
    else {
      assign(`/page=faction/fid=${facID}/view=incoming`);
    }
  }
  // Perform Targetting (K, K, K, K)
  else if (e.code === "KeyK") {
    // if not on the faction's list of nations already, go to it
    if (
      location.href.includes("page=faction") &&
      !location.href.includes("view=nations")
    ) {
      $<HTMLAnchorElement>("a.nukestat-nations")?.click();
    }
    // if on the faction's list of nations, choose a random non-fully-irradiated nation
    else if (
      location.href.includes("page=faction") &&
      location.href.includes("view=nations")
    ) {
      if ($("ol li:not(:has(.nukedestroyedicon)) a")) {
        const linkToTarget = $$<HTMLAnchorElement>(
          "ol li:not(:has(.nukedestroyedicon)) a"
        )[
          Math.floor(
            Math.random() * $$("ol li:not(:has(.nukedestroyedicon)) a").length
          )
        ]?.href;
        const regexFindNation = /(?<=nation=).*(?=\/page=nukes)/g;
        const nationToTarget = linkToTarget?.match(regexFindNation)?.[0];
        assign(`/nation=${nationToTarget}/page=nukes?target=${nationToTarget}`);
      } else {
        $<HTMLAnchorElement>('a[href^="view=nations?start="]')?.click();
      }
    }
    // if on the targetting page, calculate the appropriate number of nukes to target
    else if (
      location.href.includes("?target=") &&
      location.href.includes("page=nukes")
    ) {
      const regexFindNumber = /\d+/g;
      const alreadyTargeted = Number(
        $(".nukestat-targeted")?.textContent?.match(regexFindNumber)?.[0]
      );
      const alreadyRads = Number(
        $(".nukestat-radiation")?.textContent?.match(regexFindNumber)?.[0]
      );
      const alreadyIncoming = Number(
        $(".nukestat-incoming")?.textContent?.match(regexFindNumber)?.[0]
      );
      const already = alreadyTargeted + alreadyRads + alreadyIncoming;

      // if not enough are already targeted/rad/incoming at the nation, fire more, otherwise go back to the faction list
      if (already < 100 && $('.button[name="nukes"]')) {
        const minToTarget = 100 - already;
        const maxToTarget = minToTarget + 15;

        // choose the number of nukes within the right range
        $$('.button[name="nukes"]').forEach((element) => {
          const buttonValue = Number(element.getAttribute("value"));
          if (buttonValue <= maxToTarget) {
            const currentWindow = location.href;
            location.href = currentWindow + "&nukes=" + buttonValue;
            // any additional code if there's a captcha/additional choice?
            return false;
          }
        });
      } else {
        assign(`${$(".factionname")?.getAttribute("href")}/view=nations`);
      }
    }
  }
  // Launch Nukes (L, L, L)
  else if (e.code === "KeyL") {
    if (
      location.href.includes("view=targets") &&
      location.href.includes("page=nukes") &&
      (location.href.includes(`nation=${document.body.dataset.nname}`) ||
        !location.href.includes("/nation="))
    ) {
      // launch the first set in the list
      if ($('.button[name="launch"]')) {
        $<HTMLButtonElement>('.button[name="launch"]')?.click();
        // any additional code if there's a captcha/additional choice?
      }
      // reload the page to check for new incoming nukes
      else {
        location.reload();
      }
    } else {
      assign("/page=nukes/view=targets");
    }
  }
  // Go to Puppet Login (\)
  else if (e.code === "Backslash") {
    assign("/page=blank/puppetlist");
  }
  // Join faction (J)
  else if (e.code === "KeyJ") {
    assign(`/page=faction/fid=${facID}?consider_join_faction=1&join_faction=1`);
  }
}

/**
 * Navigates to the given URL and disables keybinds.
 * @param url The URL to navigate to.
 */
function assign(url: string | URL) {
  location.assign(url);
  disabled = true;
}
