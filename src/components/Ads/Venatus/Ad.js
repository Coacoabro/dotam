import React, { useEffect, useRef } from "react";

export default function Ad({ placementName }) {

    const elRef = useRef(null);

    useEffect(() => {
        let placement;
        console.log("[PROSPER] add", placementName);

        self.__VM.push(function (admanager, scope) {
        if (placementName === "vertical_sticky") {
            scope.Config.verticalSticky().display();
        } else if (
            placementName === "horizontal_sticky" ||
            placementName === "mobile_horizontal_sticky" ||
            placementName === "video_slider"
        ) {
            placement = scope.Config.get(placementName).displayBody();
        } else {
            placement = scope.Config.get(placementName).display(elRef.current);
        }
        });

        return () => {
        self.__VM.push(function (admanager, scope) {
            console.log("[PROSPER] removed", placementName);
            if (placementName === "vertical_sticky") {
            scope.Config.verticalSticky().destroy();
            } else {
            placement?.remove(); // Added optional chaining to handle potential undefined placement
            }
        });
        };
    }, [placementName]);

    return <div ref={elRef}></div>;

};