import { GRP } from "./GRP";

export const do_re_mi_grp_xml = `
<?xml version="1.0" encoding="UTF-8"?>
<GPR>
  <part id="P1">
    <group>
      <group>
        <group>
          <group>
            <group>
              <note id="P1-1-1" />
              <applied rule="2a" />
              <note id="P1-1-2" />
              <note id="P1-1-3" />
            </group>
            <applied rule="2b" />
            <applied rule="4" />
            <group>
              <note id="P1-1-4" />
              <note id="P1-2-1" />
              <note id="P1-2-2" />
              <note id="P1-2-3" />
            </group>
          </group>
          <applied rule="2b" />
          <group>
            <note id="P1-3-1" />
            <note id="P1-3-2" />
            <note id="P1-3-3" />
            <note id="P1-3-4" />
            <note id="P1-3-5" />
            <note id="P1-3-6" />
            <applied rule="3a" />
            <note id="P1-4-1" />
          </group>
        </group>
        <applied rule="2b" />
        <applied rule="4" />
        <group>
          <group>
            <group>
              <note id="P1-5-1" />
              <note id="P1-5-2" />
              <note id="P1-5-3" />
            </group>
            <applied rule="2b" />
            <applied rule="4" />
            <group>
              <note id="P1-5-4" />
              <note id="P1-6-1" />
              <note id="P1-6-2" />
              <note id="P1-6-3" />
            </group>
          </group>
          <applied rule="2b" />
          <group>
            <note id="P1-7-1" />
            <note id="P1-7-2" />
            <note id="P1-7-3" />
            <note id="P1-7-4" />
            <note id="P1-7-5" />
            <note id="P1-7-6" />
            <applied rule="3a" />
            <note id="P1-8-1" />
          </group>
        </group>
      </group>
      <applied rule="2b" />
      <applied rule="4" />
      <applied rule="6" />
      <group>
        <group>
          <group>
            <note id="P1-9-1" />
            <applied rule="3a" />
            <applied rule="4" />
            <applied rule="6" />
            <note id="P1-9-2" />
            <applied rule="6" />
            <note id="P1-9-3" />
            <note id="P1-9-4" />
            <note id="P1-9-5" />
            <note id="P1-9-6" />
            <note id="P1-10-1" />
          </group>
          <applied rule="2b" />
          <applied rule="4" />
          <group>
            <note id="P1-11-1" />
            <applied rule="3a" />
            <applied rule="4" />
            <note id="P1-11-2" />
            <note id="P1-11-3" />
            <note id="P1-11-4" />
            <note id="P1-11-5" />
            <note id="P1-11-6" />
            <note id="P1-12-1" />
          </group>
        </group>
        <applied rule="2b" />
        <applied rule="4" />
        <group>
          <group>
            <note id="P1-13-1" />
            <applied rule="3a" />
            <applied rule="4" />
            <note id="P1-13-2" />
            <note id="P1-13-3" />
            <note id="P1-13-4" />
            <note id="P1-13-5" />
            <note id="P1-13-6" />
            <note id="P1-14-1" />
          </group>
          <applied rule="2b" />
          <applied rule="4" />
          <group>
            <note id="P1-14-2" />
            <applied rule="3a" />
            <applied rule="4" />
            <note id="P1-14-3" />
            <applied rule="3d" />
            <note id="P1-15-1" />
            <note id="P1-15-2" />
            <applied rule="3a" />
            <note id="P1-15-3" />
            <note id="P1-15-4" />
            <note id="P1-16-1" />
          </group>
        </group>
      </group>
    </group>
  </part>
</GPR>
`;

import { XMLParser } from "fast-xml-parser";
import { options } from "../sandbox";

const parser = new XMLParser(options);
export const do_re_mi_grp = parser.parse(do_re_mi_grp_xml);


const do_re_mi_grp_raw: GRP = {
  GPR: {
    part: {
      id: "P1", group: {
        group: [
          {
            group: [
              {
                group: [
                  {
                    group: [
                      {
                        note: [
                          { id: "P1-1-1" },
                          { id: "P1-1-2" },
                          { id: "P1-1-3" }
                        ],
                        applied: { rule: "2a" }
                      },
                      {
                        note: [
                          { id: "P1-1-4" },
                          { id: "P1-2-1" },
                          { id: "P1-2-2" },
                          { id: "P1-2-3" }
                        ]
                      }
                    ],
                    applied: [
                      { rule: "2b" },
                      { rule: "4" }
                    ]
                  },
                  {
                    note: [
                      { id: "P1-3-1" },
                      { id: "P1-3-2" },
                      { id: "P1-3-3" },
                      { id: "P1-3-4" },
                      { id: "P1-3-5" },
                      { id: "P1-3-6" },
                      { id: "P1-4-1" }
                    ],
                    applied: { rule: "3a" }
                  }
                ],
                applied: { rule: "2b" }
              },
              {
                group: [
                  {
                    group: [
                      {
                        note: [
                          { id: "P1-5-1" },
                          { id: "P1-5-2" },
                          { id: "P1-5-3" }
                        ]
                      },
                      {
                        note: [
                          { id: "P1-5-4" },
                          { id: "P1-6-1" },
                          { id: "P1-6-2" },
                          { id: "P1-6-3" }
                        ]
                      }
                    ],
                    applied: [
                      { rule: "2b" },
                      { rule: "4" }
                    ]
                  },
                  {
                    note: [
                      { id: "P1-7-1" },
                      { id: "P1-7-2" },
                      { id: "P1-7-3" },
                      { id: "P1-7-4" },
                      { id: "P1-7-5" },
                      { id: "P1-7-6" },
                      { id: "P1-8-1" }
                    ],
                    applied: { rule: "3a" }
                  }
                ],
                applied: { rule: "2b" }
              }
            ],
            applied: [
              { rule: "2b" },
              { rule: "4" }
            ]
          },
          {
            group: [
              {
                group: [
                  {
                    note: [
                      { id: "P1-9-1" },
                      { id: "P1-9-2" },
                      { id: "P1-9-3" },
                      { id: "P1-9-4" },
                      { id: "P1-9-5" },
                      { id: "P1-9-6" },
                      { id: "P1-10-1" }
                    ],
                    applied: [
                      { rule: "3a" },
                      { rule: "4" },
                      { rule: "6" },
                      { rule: "6" }
                    ]
                  },
                  {
                    note: [
                      { id: "P1-11-1" },
                      { id: "P1-11-2" },
                      { id: "P1-11-3" },
                      { id: "P1-11-4" },
                      { id: "P1-11-5" },
                      { id: "P1-11-6" },
                      { id: "P1-12-1" }
                    ],
                    applied: [
                      { rule: "3a" },
                      { rule: "4" }
                    ]
                  }
                ],
                applied: [
                  { rule: "2b" },
                  { rule: "4" }
                ]
              },
              {
                group: [
                  {
                    note: [
                      { id: "P1-13-1" },
                      { id: "P1-13-2" },
                      { id: "P1-13-3" },
                      { id: "P1-13-4" },
                      { id: "P1-13-5" },
                      { id: "P1-13-6" },
                      { id: "P1-14-1" }
                    ],
                    applied: [
                      { rule: "3a" },
                      { rule: "4" }
                    ]
                  },
                  {
                    note: [
                      { id: "P1-14-2" },
                      { id: "P1-14-3" },
                      { id: "P1-15-1" },
                      { id: "P1-15-2" },
                      { id: "P1-15-3" },
                      { id: "P1-15-4" },
                      { id: "P1-16-1" }
                    ],
                    applied: [
                      { rule: "3a" },
                      { rule: "4" },
                      { rule: "3d" },
                      { rule: "3a" }
                    ]
                  }
                ],
                applied: [
                  { rule: "2b" },
                  { rule: "4" }
                ]
              }
            ],
            applied: [
              { rule: "2b" },
              { rule: "4" }
            ]
          }
        ],
        applied: [
          { rule: "2b" },
          { rule: "4" },
          { rule: "6" }
        ]
      }
    }
  }
};
