const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const facID = "27"; // update when N-Day starts!

// clear production query parameters
if (location.search.includes("convertproduction")) {
  const currentPage = new URL(location.href);
  currentPage.searchParams.delete("convertproduction");
  history.replaceState(null, "", currentPage);
}

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

/**
 * Generate a random integer between zero (inclusive) and `max` (exclusive)
 */
function randInt(max: number) {
  return Math.floor(Math.random() * max);
}

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

  // Close tab (C)
  if (e.code === "KeyC") {
    window.close();
  }

  // Go Back (,)
  else if (e.code === "Comma") {
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
      const specialistType = $("span.fancylike")?.textContent;
      const production = Number(
        $(".nukestat-production")?.textContent?.match(/\d+/)?.[0]
      );

      switch (specialistType) {
        // milspec ratio 3:2 (nukes:production)
        case "Military Specialist":
          if (production < 2) return;
          produce("nukes", Math.floor(production * 1.5));
          break;
        // intspec ratio 1:1 (nukes:production)
        case "Intel Specialist":
          if (production < 1) return;
          produce("nukes", Math.floor(production));
          break;
        // stratspec ratio 3:4 (shields:production)
        case "Strategic Specialist":
          if (production < 4) return;
          produce("shield", Math.floor(production / 4) * 3);
          break;
        // econspec ratio 1:2 (shields:production)
        case "Economic Specialist":
          if (production < 2) return;
          produce("shield", Math.floor(production / 2));
          break;
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
      const specialistType = $("span.fancylike")?.textContent;
      const production = Number(
        $(".nukestat-production")?.textContent?.match(/\d+/)?.[0]
      );

      switch (specialistType) {
        // milspec ratio 3:2 (nukes:production)
        case "Military Specialist":
          if (production < 2) return;
          produce("nukes", Math.floor(production * 1.5));
          break;
        // others ratio 1:1 (nukes:production)
        case "Intel Specialist":
        case "Strategic Specialist":
        case "Economic Specialist":
          if (production < 1) return;
          produce("nukes", Math.floor(production));
          break;
      }
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
      const specialistType = $("span.fancylike")?.textContent;
      const production = Number(
        $(".nukestat-production")?.textContent?.match(/\d+/)?.[0]
      );

      switch (specialistType) {
        // stratspec ratio 3:4 (shields:production)
        case "Strategic Specialist":
          if (production < 4) return;
          produce("shield", Math.floor(production / 4) * 3);
          break;
        // others ratio 1:2 (shields:production)
        case "Military Specialist":
        case "Intel Specialist":
        case "Economic Specialist":
          if (production < 2) return;
          produce("shield", Math.floor(production / 2));
          break;
      }
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
          randInt($$('.button[name="defend"]').length)
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
      const nations = Number(
        $(".nukestat-nations")?.textContent?.replaceAll(/\D/g, "")
      );
      if (nations > 50) {
        assign(
          `${location.pathname}/view=nations?start=${randInt(nations - 50)}`
        );
      } else {
        assign(`${location.pathname}/view=nations`);
      }
    }
    // if on the faction's list of nations, choose a random non-fully-irradiated nation
    else if (
      location.href.includes("page=faction") &&
      location.href.includes("view=nations")
    ) {
      const targets = [...$$<HTMLAnchorElement>("ol li")]
        .filter((node) => !node.querySelector(".nukedestroyedicon"))
        .map((node) => node.querySelector<HTMLAnchorElement>("a.nlink"));

      if (targets.length) {
        const linkToTarget = targets[randInt(targets.length)]?.href;
        const nationToTarget = linkToTarget?.match(
          /nation=(?<nation>.*)\/page=nukes/
        )?.groups?.nation;
        assign(`/nation=${nationToTarget}/page=nukes?target=${nationToTarget}`);
      } else {
        $<HTMLAnchorElement>('a[href*="view=nations?start="]')?.click();
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

      const available = Number(
        $(".nukeselfview .nukestat-nukes")?.textContent?.match(
          regexFindNumber
        )?.[0]
      );

      // if not enough are already targeted/rad/incoming at the nation, fire more, otherwise go back to the faction list
      if (alreadyRads < 100 && already < 175 && $('.button[name="nukes"]')) {
        const searchParams = new URLSearchParams(location.search);
        searchParams.append(
          "nukes",
          Math.min(175 - already, available).toString()
        );

        assign(`${location.pathname}?${searchParams.toString()}`);
      } else {
        $<HTMLAnchorElement>("a.factionname")?.click();
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

function assignSearch(
  params: ConstructorParameters<typeof URLSearchParams>[0]
) {
  console.log(`${location.pathname}?${new URLSearchParams(params)}`);
  assign(`${location.pathname}?${new URLSearchParams(params)}`);
}

function produce(type: "nukes" | "shield", amount: number) {
  const captchaResponse = $<HTMLInputElement>(
    "input#g-recaptcha-response"
  )?.value;

  if (captchaResponse) {
    assignSearch({
      convertproduction: `${type}:${amount}`,
      ...(captchaResponse && { "g-recaptcha-response": captchaResponse }),
    });
  } else {
    $<HTMLButtonElement>(
      `.button[name="convertproduction"][value^="${type}"]`
    )?.click();
  }
}
