import { useState } from "react";
import clsx from "@italodeandra/ui/utils/clsx";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import Button from "@italodeandra/ui/components/Button";
import Checkbox from "@italodeandra/ui/components/Checkbox";
import stopPropagation from "@italodeandra/ui/utils/stopPropagation";
import { uniq, xor } from "lodash-es";

const clients = [
  {
    _id: "66ca2cdd90dc4e9f92e8e07d",
    name: "Majapi",
    projects: [
      {
        _id: "66ca2ce132973d1fd86e43d6",
        name: "UI",
      },
      {
        _id: "66ca2ce5d3c0ae07af1904a3",
        name: "Auth",
      },
      {
        _id: "66ca2cf7cf750694c3f7fedf",
        name: "Landing",
      },
      {
        _id: "66ca2d1ecd2858dd3c876a48",
        name: "Ticketis",
      },
      {
        _id: "66ca2ce891f52d7bb75cd5f9",
        name: "Miyachi",
      },
      {
        _id: "66ca2d3a4043e40f8bf0007a",
        name: "Logs",
      },
    ],
  },
  {
    _id: "66ca2c4de1445ffdf9210431",
    name: "FirstBatch",
    projects: [
      {
        _id: "66ca2c8ab575a5d6536f7120",
        name: "Swan",
      },
      {
        _id: "66ca2c5181a56e5d1b6a949a",
        name: "Dria",
      },
      {
        _id: "66ca2c96f342ab923107f413",
        name: "Landing",
      },
    ],
  },
  {
    _id: "66ca2c5399c2f1df2243975e",
    name: "Âncora",
    projects: [
      {
        _id: "66ca2c55f64272d38f2aaaeb",
        name: "Sailor",
      },
    ],
  },
  {
    _id: "66ca2cb6c0f10a34d2ac14d9",
    name: "Facebot",
    projects: [
      {
        _id: "66ca2cc75b8faafd263fa802",
        name: "Facebot",
      },
    ],
  },
  {
    _id: "66ca2c71833a553d00fbb876",
    name: "Reese",
    projects: [
      {
        _id: "66ca2c74d82bb02fbcb712c0",
        name: "The Short Term Spot",
      },
    ],
  },
  {
    _id: "66ca2c5831842acd6a2eb37c",
    name: "Saúde Móvel",
    projects: [
      {
        _id: "66ca2c5bbf2303591a687b70",
        name: "Remoções Hospitalar",
      },
    ],
  },
];

export function Projects() {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div className="flex px-2">
      <div
        className={clsx("rounded-lg bg-white/[0.03] p-2 transition-colors", {
          "bg-white/10": !!selected.length,
        })}
      >
        <Accordion.Root type="multiple">
          <Accordion.Item
            value="projects"
            className="group whitespace-nowrap text-zinc-300"
          >
            <div className="flex items-center gap-1.5">
              <Accordion.Trigger className="flex items-center gap-1.5 pl-1 text-xs">
                <span className="font-medium hover:text-white">Projects</span>
                <ChevronDownIcon className="-ml-0.5 h-4 w-4 group-data-[state=open]:rotate-180" />
              </Accordion.Trigger>
              <div className="grow" />
              {!!selected.length && (
                <Button
                  variant="text"
                  size="xs"
                  className="-my-1.5 px-1 py-0.5"
                  onClick={() => setSelected([])}
                >
                  Clear
                </Button>
              )}
            </div>
            <Accordion.Content className="data-[state=open]:animate-expand data-[state=closed]:animate-collapse overflow-hidden">
              <div className="flex gap-1 pt-1">
                <div className="flex flex-col gap-1 rounded-lg bg-black/20 p-2">
                  <label className="flex items-center gap-1.5 text-sm">
                    <Checkbox
                      onClick={stopPropagation}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelected(uniq([...selected, "__NONE__"]));
                        } else {
                          setSelected(xor(selected, ["__NONE__"]));
                        }
                      }}
                      checked={selected.includes("__NONE__")}
                    />
                    <span className="hover:text-white">None</span>
                  </label>
                </div>
                {clients.map((client) => {
                  const selectedAllProjects = client.projects.every((p) =>
                    selected.includes(p._id),
                  );
                  return (
                    <Accordion.Root type="multiple" key={client._id}>
                      <Accordion.Item
                        value={client._id}
                        className="group/project flex flex-col gap-1 rounded-lg bg-black/20 p-2"
                      >
                        <Accordion.Trigger className="flex items-center gap-1.5 text-sm">
                          <Checkbox
                            onClick={stopPropagation}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelected(
                                  uniq([
                                    ...selected,
                                    ...client.projects.map((p) => p._id),
                                  ]),
                                );
                              } else {
                                setSelected(
                                  xor(
                                    selected,
                                    client.projects.map((p) => p._id),
                                  ),
                                );
                              }
                            }}
                            checked={selectedAllProjects}
                            indeterminate={
                              !selectedAllProjects &&
                              client.projects.some((p) =>
                                selected.includes(p._id),
                              )
                            }
                          />
                          <span className="hover:text-white">
                            {client.name}
                          </span>
                          <ChevronDownIcon className="-ml-0.5 h-4 w-4 group-data-[state=open]/project:rotate-180" />
                        </Accordion.Trigger>
                        <Accordion.Content className="data-[state=open]:animate-expand data-[state=closed]:animate-collapse overflow-hidden">
                          <div className="flex flex-col gap-1 rounded-lg bg-white/[0.01] p-2">
                            {client.projects.map((project) => (
                              <label
                                className="flex items-center gap-1.5 text-sm"
                                key={project._id}
                              >
                                <Checkbox
                                  checked={selected.includes(project._id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelected([...selected, project._id]);
                                    } else {
                                      setSelected(xor(selected, [project._id]));
                                    }
                                  }}
                                />
                                <span>{project.name}</span>
                              </label>
                            ))}
                          </div>
                        </Accordion.Content>
                      </Accordion.Item>
                    </Accordion.Root>
                  );
                })}
              </div>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>
    </div>
  );
}
