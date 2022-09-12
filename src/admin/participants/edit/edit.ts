import { Request, Response } from "express";

import logger from "../../../logger";
import ParticipantRepository from "../../../participant/ParticipantRepository";

const participantRepository = new ParticipantRepository();

export async function get(req: Request, res: Response): Promise<void> {
    logger.info("Rendering page: participant by email");

    const participant = await participantRepository.getOne(req.params.email);

    return res.render("editParticipant", {
        emailRequested: req.params.email,
        participant: participant
    });
}

export async function post(req: Request, res: Response): Promise<void> {
    logger.info("Updating participant");

    const data = consolidateNetworkInputs(req.body);
    let participant = await participantRepository.getOne(req.params.email);
    logger.debug(JSON.stringify(data))
    //@ts-ignore
    participant = Object.assign(participant, data);
    await participant?.save();

    // If we change the email we must also change the location
    if (participant?.email !== req.params.email) {
        return res.redirect("/admin/participants/" + participant?.email);
    } else {
        return res.render("editParticipant", {
            emailRequested: req.params.email,
            participant: participant,
            errors: ["Test Error"],
        });
    }
}

// Networks are input into the form as multiple text fields with the
// name network- followed by their index.
// e.g. network-0, network-1, ... etc
// We need to turn those into an array.
function consolidateNetworkInputs(data: any): any {
    const output: Record<string, any> = {
        networks: [],
    };

    for (const [k, v] of Object.entries(data)) {
        if (k.match("network-[0-9]+")) {
            output.networks.push(v);
        } else {
            output[k] = v;
        }
    }

    return output;
}
