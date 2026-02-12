"use client";

import { useState } from "react";
import Image from "next/image";
import CollectibleShadow from "@/data/CollectibleShadow";
import { Trait } from "./Trait";
import { TraitButton } from "./TraitButton";
import {
  LucideEye,
  LucideHand,
  LucideHeadphones,
  LucideLabScissorsHairComb,
  LucideLabTrousers,
  LucidePaintbrushVertical,
  LucideShirt,
  LucideSmile,
  LucideSquareCheck,
  LucideTrees,
} from "@/components/icons/Lucide";
import { ColorPicker } from "./ColorPicker";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

type TraitKey =
  | "rightHand"
  | "leftHand"
  | "hat"
  | "hairFront"
  | "eyes"
  | "face"
  | "top"
  | "bottom"
  | "hairBack";

type Traits = Partial<Record<TraitKey, string>>;

const zIndexMap: Record<TraitKey, number> = {
  rightHand: 9,
  leftHand: 8,
  hat: 7,
  hairFront: 6,
  eyes: 5,
  face: 4,
  top: 3,
  bottom: 2,
  hairBack: 1,
};

function getZIndex(key: TraitKey): number {
  return zIndexMap[key];
}

function parseHairTrait(trait: string) {
  const hairIndex = trait.indexOf("_hair_");
  const rest = trait.slice(hairIndex + 6);

  let frontId = "";
  let backId = "";

  if (rest.length > 22) {
    frontId = rest.slice(-23, -12);
    backId = rest.slice(-11);
  } else {
    frontId = rest.slice(-11);
  }

  return { frontId, backId };
}

function parseTraits(traitSlice: string[]): Traits {
  const traits: Traits = {};

  if (traitSlice[0]?.startsWith("t2_")) {
    for (let trait of traitSlice) {
      if (trait.includes("VERSION_2")) {
        trait = trait.slice(0, -10);
      }
      if (trait.includes("_hair_")) {
        const parsed = parseHairTrait(trait);
        if (parsed!.frontId && !parsed?.backId) {
          traits.hairFront = trait.slice(-11) + "_";
        } else {
          traits.hairFront = trait.slice(-23, -12) + "_";
          traits.hairBack = trait.slice(-11) + "_";
        }
      } else if (trait.includes("_body_bottom_")) {
        traits.bottom = trait.slice(-11) + "_";
      } else if (trait.includes("_body_")) {
        traits.top = trait.slice(-11) + "_";
      } else if (trait.includes("_face_lower_")) {
        traits.face = trait.slice(-11) + "_";
      } else if (trait.includes("_face_upper_")) {
        traits.eyes = trait.slice(-11) + "_";
      } else if (trait.includes("_head_accessory_")) {
        traits.hat = trait.slice(-11) + "_";
      } else if (trait.includes("_accessory_back_")) {
        traits.rightHand = trait.slice(-11) + "_";
      } else if (trait.includes("_accessory_")) {
        traits.leftHand = trait.slice(-11) + "_";
      }
    }
  } else {
    // Non t2_ -> Gen 1 or 2
    for (const trait of traitSlice) {
      if (trait.includes("_hair_")) {
        const parsed = parseHairTrait(trait);
        if (trait.includes("VERSION_2") || (parsed.frontId && !parsed.backId)) {
          traits.hairFront = trait.slice(-11) + "_" + trait.slice(0, -12);
        } else {
          traits.hairFront = trait.slice(-23, -12) + "_" + trait.slice(0, -24);
          traits.hairBack = trait.slice(-11) + "_" + trait.slice(0, -24);
        }
      } else if (trait.includes("_body_bottom_")) {
        traits.bottom = trait.slice(-11) + "_" + trait.slice(0, -12);
      } else if (trait.includes("_body_")) {
        traits.top = trait.slice(-11) + "_" + trait.slice(0, -12);
      } else if (trait.includes("_face_lower_")) {
        traits.face = trait.slice(-11) + "_" + trait.slice(0, -12);
      } else if (trait.includes("_face_upper_")) {
        traits.eyes = trait.slice(-11) + "_" + trait.slice(0, -12);
      } else if (trait.includes("_head_accessory_")) {
        traits.hat = trait.slice(-11) + "_" + trait.slice(0, -12);
      } else if (trait.includes("_accessory_back_")) {
        traits.rightHand = trait.slice(-11) + "_" + trait.slice(0, -12);
      } else if (trait.includes("_accessory_")) {
        traits.leftHand = trait.slice(-11) + "_" + trait.slice(0, -12);
      }
    }
  }

  return traits;
}

export default function CollectibleViewer({
  traitIds,
  backgroundUrl,
}: {
  traitIds: string[];
  backgroundUrl: string;
}) {
  const [loadedCounter, setLoadedCounter] = useState(0);
  const [visibleTraits, setVisibleTraits] = useState<Record<TraitKey, boolean>>(
    {
      rightHand: true,
      leftHand: true,
      hat: true,
      hairFront: true,
      eyes: true,
      face: true,
      top: true,
      bottom: true,
      hairBack: true,
    },
  );

  const [bodyColor, setBodyColor] = useState("#00FF00");
  const [eyeColor, setEyeColor] = useState("#FFFF00");
  const [hairColor, setHairColor] = useState("#0000FF");
  const [whiteBackground, setWhiteBackground] = useState(false);

  const [open, setOpen] = useState(false);

  const traits = parseTraits(traitIds);
  const totalToLoad =
    Object.values(traits).filter((v): v is string => !!v).length + 1;
  const loaded = loadedCounter >= totalToLoad;

  const incrementLoadedCounter = () => {
    setLoadedCounter((prev) => prev + 1);
  };

  const toggleGroup = (keys: TraitKey[]) => {
    const allVisible = keys.every((key) => visibleTraits[key]);
    setVisibleTraits((prev) => {
      const updated = { ...prev };
      keys.forEach((key) => {
        if (traits[key]) updated[key] = !allVisible;
      });
      return updated;
    });
  };

  const toggleAllTraits = () => {
    const hasAnyVisibleTrait = Object.entries(traits).some(
      ([key, value]) => visibleTraits[key as TraitKey] && value,
    );

    setVisibleTraits((prev) => {
      const updated = { ...prev };
      Object.keys(traits).forEach((key) => {
        if (traits[key as TraitKey]) {
          updated[key as TraitKey] = !hasAnyVisibleTrait;
        }
      });
      return updated;
    });
  };

  const hasAnyVisibleTrait = Object.entries(traits).some(
    ([key, value]) => visibleTraits[key as TraitKey] && value,
  );

  return (
    <div className="px-horizontal flex flex-col gap-3 pb-3 sm:grid sm:grid-cols-7">
      <div className="relative col-span-4 flex aspect-3/4 h-fit w-fit flex-col items-center justify-center self-center">
        <Image
          src={backgroundUrl}
          alt="background"
          width={552}
          height={736}
          className={`${!loaded ? "op acity-0" : "opacity-100"} ${
            whiteBackground ? "brightness-0 invert" : ""
          }`}
          onLoad={incrementLoadedCounter}
          unoptimized
        />

        {hasAnyVisibleTrait && (
          <CollectibleShadow
            className={`absolute h-[calc(600/736*100%)] w-[calc(380/552*100%)] ${
              !loaded ? "opacity-0" : "opacity-100"
            }`}
          />
        )}

        {(Object.keys(traits) as TraitKey[]).map((key) => {
          const value = traits[key];
          if (!value || !visibleTraits[key]) return null;

          const src =
            value.at(-1) !== "_"
              ? `https://i.redd.it/snoovatar/snoo_assets/${value}.svg`
              : `https://i.redd.it/snoovatar/snoo_assets/submissions/${value}.svg`;

          return (
            <Trait
              key={key}
              traitId={value}
              src={src}
              alt={key}
              className={`absolute h-[calc(600/736*100%)] w-[calc(380/552*100%)] ${!loaded ? "opacity-0" : "opacity-100"}`}
              zIndex={getZIndex(key)}
              onLoad={incrementLoadedCounter}
              bodyColor={bodyColor}
              eyeColor={eyeColor}
              hairColor={hairColor}
            />
          );
        })}
      </div>

      {/* Trait toggles */}
      <div className="scrollbar-hidden flex flex-col gap-2 overflow-y-scroll sm:col-span-3 sm:overflow-y-clip">
        <div className="flex h-fit grid-cols-3 gap-1 sm:grid sm:gap-2">
          <TraitButton
            onClick={() => toggleGroup(["leftHand"])}
            disabled={!loaded || !traits.leftHand}
            data-active={visibleTraits.leftHand}
            data-exists={!!traits.leftHand}
          >
            <LucideHand className="-scale-x-100" />
          </TraitButton>

          <TraitButton
            onClick={() => toggleGroup(["rightHand"])}
            disabled={!loaded || !traits.rightHand}
            data-active={visibleTraits.rightHand}
            data-exists={!!traits.rightHand}
          >
            <LucideHand />
          </TraitButton>

          <TraitButton
            onClick={() => toggleGroup(["hat"])}
            disabled={!loaded || !traits.hat}
            data-active={visibleTraits.hat}
            data-exists={!!traits.hat}
          >
            <LucideHeadphones />
          </TraitButton>

          <TraitButton
            onClick={() => toggleGroup(["hairFront", "hairBack"])}
            disabled={!loaded || (!traits.hairFront && !traits.hairBack)}
            data-active={visibleTraits.hairFront && visibleTraits.hairBack}
            data-exists={!!traits.hairFront || !!traits.hairBack}
          >
            <LucideLabScissorsHairComb />
          </TraitButton>

          <TraitButton
            onClick={() => toggleGroup(["eyes"])}
            disabled={!loaded || !traits.eyes}
            data-active={visibleTraits.eyes}
            data-exists={!!traits.eyes}
          >
            <LucideEye />
          </TraitButton>

          <TraitButton
            onClick={() => toggleGroup(["face"])}
            disabled={!loaded || !traits.face}
            data-active={visibleTraits.face}
            data-exists={!!traits.face}
          >
            <LucideSmile />
          </TraitButton>

          <TraitButton
            onClick={() => toggleGroup(["top"])}
            disabled={!loaded || !traits.top}
            data-active={visibleTraits.top}
            data-exists={!!traits.top}
          >
            <LucideShirt />
          </TraitButton>

          <TraitButton
            onClick={() => toggleGroup(["bottom"])}
            disabled={!loaded || !traits.bottom}
            data-active={visibleTraits.bottom}
            data-exists={!!traits.bottom}
          >
            <LucideLabTrousers />
          </TraitButton>

          <TraitButton
            onClick={toggleAllTraits}
            disabled={!loaded}
            data-active={hasAnyVisibleTrait}
            data-exists={true}
          >
            <LucideSquareCheck />
          </TraitButton>

          <Drawer open={open} onOpenChange={setOpen} handleOnly>
            <DrawerTrigger asChild>
              <TraitButton
                onTouchStart={() => {
                  // TODO: Update the hardcoded magic number 80 to the actual distance from the top once the header has been designed
                  window.scrollTo({ top: 80, behavior: "smooth" });
                  const checkScroll = () => {
                    if (window.scrollY === 80) {
                      setOpen(true);
                    } else {
                      requestAnimationFrame(checkScroll);
                    }
                  };
                  checkScroll();
                }}
                disabled={!loaded}
                data-exists={true}
                className="sm:hidden"
              >
                <LucidePaintbrushVertical />
              </TraitButton>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="sr-only">
                <DrawerTitle>Color Picker</DrawerTitle>
              </DrawerHeader>

              <div className="h-[40vh] p-1">
                <ColorPicker
                  onBodyChange={setBodyColor}
                  onEyeChange={setEyeColor}
                  onHairChange={setHairColor}
                  initialBody={bodyColor}
                  initialEye={eyeColor}
                  initialHair={hairColor}
                />
              </div>
            </DrawerContent>
          </Drawer>

          <TraitButton
            onClick={() => setWhiteBackground(!whiteBackground)}
            disabled={!loaded}
            data-active={!whiteBackground}
            data-exists={true}
            className="col-span-3 select-none"
          >
            <LucideTrees /> <span>Background</span>
          </TraitButton>
        </div>
        <div className="bg-dim/5 border-dim/5 hidden h-full w-full rounded-xl border sm:block">
          <ColorPicker
            onBodyChange={setBodyColor}
            onEyeChange={setEyeColor}
            onHairChange={setHairColor}
          />
        </div>
      </div>
    </div>
  );
}
