import { ITimeSpanReduction } from "../src/analysis-result";

export const do_re_mi_tsr_raw: ITimeSpanReduction = {
  tstree: {
    ts: {
      timespan: 64.0,
      leftend: 0.0,
      rightend: 64.0,
      head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-9-1" } } },
      at: { temp: { difference: 0.0, stable: "unknown", pred: { temp: "-inf" }, succ: { temp: "+inf" } } },
      primary: {
        ts: {
          timespan: 32.0,
          leftend: 32.0,
          rightend: 64.0,
          head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-9-1" } } },
          at: { temp: { difference: 0.0, stable: "unknown", pred: { temp: "-inf" }, succ: { temp: "+inf" } } },
          primary: {
            ts: {
              timespan: 16.0,
              leftend: 32.0,
              rightend: 48.0,
              head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-9-1" } } },
              at: { temp: { difference: 0.0, stable: "unknown", pred: { temp: "-inf" }, succ: { temp: "+inf" } } },
              primary: {
                ts: {
                  timespan: 8.0,
                  leftend: 32.0,
                  rightend: 40.0,
                  head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-9-1" } } },
                  at: { temp: { difference: 0.0, stable: "unknown", pred: { temp: "-inf" }, succ: { temp: "+inf" } } },
                  primary: {
                    ts: {
                      timespan: 4.0,
                      leftend: 32.0,
                      rightend: 36.0,
                      head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-9-1" } } },
                      at: { temp: { difference: 0.0, stable: "unknown", pred: { temp: "-inf" }, succ: { temp: "+inf" } } },
                      primary: {
                        ts: {
                          timespan: 2.0,
                          leftend: 32.0,
                          rightend: 34.0,
                          head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-9-1" } } },
                          at: { temp: { difference: 0.0, stable: "unknown", pred: { temp: "-inf" }, succ: { temp: "+inf" } } },
                          primary: {
                            ts: {
                              timespan: 1.5,
                              leftend: 32.0,
                              rightend: 33.5,
                              head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-9-1" } } },
                              at: { temp: { difference: 0.0, stable: "unknown", pred: { temp: "-inf" }, succ: { temp: "+inf" } } }
                            }
                          },
                          secondary: {
                            ts: {
                              timespan: 0.5,
                              leftend: 33.5,
                              rightend: 34.0,
                              head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-9-2" } } },
                              at: { temp: { difference: 1.5, stable: 0, pred: { temp: 0 }, succ: { temp: "+inf" } } }
                            }
                          }
                        }
                      },
                      secondary: {
                        ts: {
                          timespan: 2.0,
                          leftend: 34.0,
                          rightend: 36.0,
                          head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-9-3" } } },
                          at: { temp: { difference: 2.0, stable: 0, pred: { temp: 0 }, succ: { temp: "+inf" } } },
                          primary: {
                            ts: {
                              timespan: 1.0,
                              leftend: 34.0,
                              rightend: 35.0,
                              head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-9-3" } } },
                              at: { temp: { difference: 2.0, stable: 0, pred: { temp: 0 }, succ: { temp: "+inf" } } },
                              primary: {
                                ts: {
                                  timespan: 0.5,
                                  leftend: 34.0,
                                  rightend: 34.5,
                                  head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-9-3" } } },
                                  at: { temp: { difference: 2.0, stable: 0, pred: { temp: 0 }, succ: { temp: "+inf" } } }
                                }
                              },
                              secondary: {
                                ts: {
                                  timespan: 0.5,
                                  leftend: 34.5,
                                  rightend: 35.0,
                                  head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-9-4" } } },
                                  at: { temp: { difference: 0.5, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } }
                                }
                              }
                            }
                          },
                          secondary: {
                            ts: {
                              timespan: 1.0,
                              leftend: 35.0,
                              rightend: 36.0,
                              head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-9-5" } } },
                              at: { temp: { difference: 1.0, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } },
                              primary: {
                                ts: {
                                  timespan: 0.5,
                                  leftend: 35.0,
                                  rightend: 35.5,
                                  head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-9-5" } } },
                                  at: { temp: { difference: 1.0, stable: "./../..", pred: { temp: "./../.." }, succ: { temp: "+inf" } } }
                                }
                              },
                              secondary: {
                                ts: {
                                  timespan: 0.5,
                                  leftend: 35.5,
                                  rightend: 36.0,
                                  head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-9-6" } } },
                                  at: { temp: { difference: 0.5, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  secondary: {
                    ts: {
                      timespan: 4.0,
                      leftend: 36.0,
                      rightend: 40.0,
                      head: { chord: { duration: 4.0, velocity: 90, note: { id: "P1-10-1" } } },
                      at: { temp: { difference: 4.0, stable: 0, pred: { temp: 0 }, succ: { temp: "+inf" } } }
                    }
                  }
                }
              },
              secondary: {
                ts: {
                  timespan: 8.0,
                  leftend: 40.0,
                  rightend: 48.0,
                  head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-11-1" } } },
                  at: { temp: { difference: 8.0, stable: 0, pred: { temp: 0 }, succ: { temp: "+inf" } } },
                  primary: {
                    ts: {
                      timespan: 4.0,
                      leftend: 40.0,
                      rightend: 44.0,
                      head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-11-1" } } },
                      at: { temp: { difference: 8.0, stable: 0, pred: { temp: 0 }, succ: { temp: "+inf" } } },
                      primary: {
                        ts: {
                          timespan: 2.0,
                          leftend: 40.0,
                          rightend: 42.0,
                          head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-11-1" } } },
                          at: { temp: { difference: 8.0, stable: 0, pred: { temp: 0 }, succ: { temp: "+inf" } } },
                          primary: {
                            ts: {
                              timespan: 1.5,
                              leftend: 40.0,
                              rightend: 41.5,
                              head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-11-1" } } },
                              at: { temp: { difference: 8.0, stable: 0, pred: { temp: 0 }, succ: { temp: "+inf" } } }
                            }
                          },
                          secondary: {
                            ts: {
                              timespan: 0.5,
                              leftend: 41.5,
                              rightend: 42.0,
                              head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-11-2" } } },
                              at: { temp: { difference: 1.5, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } }
                            }
                          }
                        }
                      },
                      secondary: {
                        ts: {
                          timespan: 2.0,
                          leftend: 42.0,
                          rightend: 44.0,
                          head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-11-3" } } },
                          at: { temp: { difference: 2.0, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } },
                          primary: {
                            ts: {
                              timespan: 1.0,
                              leftend: 42.0,
                              rightend: 43.0,
                              head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-11-3" } } },
                              at: { temp: { difference: 2.0, stable: "./../..", pred: { temp: "./../.." }, succ: { temp: "+inf" } } },
                              primary: {
                                ts: {
                                  timespan: 0.5,
                                  leftend: 42.0,
                                  rightend: 42.5,
                                  head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-11-3" } } },
                                  at: { temp: { difference: 2.0, stable: "./../../..", pred: { temp: "./../../.." }, succ: { temp: "+inf" } } }
                                }
                              },
                              secondary: {
                                ts: {
                                  timespan: 0.5,
                                  leftend: 42.5,
                                  rightend: 43.0,
                                  head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-11-4" } } },
                                  at: { temp: { difference: 0.5, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } }
                                }
                              }
                            }
                          },
                          secondary: {
                            ts: {
                              timespan: 1.0,
                              leftend: 43.0,
                              rightend: 44.0,
                              head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-11-5" } } },
                              at: { temp: { difference: 1.0, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } },
                              primary: {
                                ts: {
                                  timespan: 0.5,
                                  leftend: 43.0,
                                  rightend: 43.5,
                                  head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-11-5" } } },
                                  at: { temp: { difference: 1.0, stable: "./../..", pred: { temp: "./../.." }, succ: { temp: "+inf" } } }
                                }
                              },
                              secondary: {
                                ts: {
                                  timespan: 0.5,
                                  leftend: 43.5,
                                  rightend: 44.0,
                                  head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-11-6" } } },
                                  at: { temp: { difference: 0.5, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  secondary: {
                    ts: {
                      timespan: 4.0,
                      leftend: 44.0,
                      rightend: 48.0,
                      head: { chord: { duration: 4.0, velocity: 90, note: { id: "P1-12-1" } } },
                      at: { temp: { difference: 4.0, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } }
                    }
                  }
                }
              }
            }
          },
          secondary: {
            ts: {
              timespan: 16.0,
              leftend: 48.0,
              rightend: 64.0,
              head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-13-1" } } },
              at: { temp: { difference: 16.0, stable: 0, pred: { temp: 0 }, succ: { temp: "+inf" } } },
              primary: {
                ts: {
                  timespan: 7.0,
                  leftend: 48.0,
                  rightend: 55.0,
                  head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-13-1" } } },
                  at: { temp: { difference: 16.0, stable: 0, pred: { temp: 0 }, succ: { temp: "+inf" } } },
                  primary: {
                    ts: {
                      timespan: 4.0,
                      leftend: 48.0,
                      rightend: 52.0,
                      head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-13-1" } } },
                      at: { temp: { difference: 16.0, stable: 0, pred: { temp: 0 }, succ: { temp: "+inf" } } },
                      primary: {
                        ts: {
                          timespan: 2.0,
                          leftend: 48.0,
                          rightend: 50.0,
                          head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-13-1" } } },
                          at: { temp: { difference: 16.0, stable: 0, pred: { temp: 0 }, succ: { temp: "+inf" } } },
                          primary: {
                            ts: {
                              timespan: 1.5,
                              leftend: 48.0,
                              rightend: 49.5,
                              head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-13-1" } } },
                              at: { temp: { difference: 16.0, stable: 0, pred: { temp: 0 }, succ: { temp: "+inf" } } }
                            }
                          },
                          secondary: {
                            ts: {
                              timespan: 0.5,
                              leftend: 49.5,
                              rightend: 50.0,
                              head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-13-2" } } },
                              at: { temp: { difference: 1.5, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } }
                            }
                          }
                        }
                      },
                      secondary: {
                        ts: {
                          timespan: 2.0,
                          leftend: 50.0,
                          rightend: 52.0,
                          head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-13-3" } } },
                          at: { temp: { difference: 2.0, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } },
                          primary: {
                            ts: {
                              timespan: 1.0,
                              leftend: 50.0,
                              rightend: 51.0,
                              head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-13-3" } } },
                              at: { temp: { difference: 2.0, stable: "./../..", pred: { temp: "./../.." }, succ: { temp: "+inf" } } },
                              primary: {
                                ts: {
                                  timespan: 0.5,
                                  leftend: 50.0,
                                  rightend: 50.5,
                                  head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-13-3" } } },
                                  at: { temp: { difference: 2.0, stable: "./../../..", pred: { temp: "./../../.." }, succ: { temp: "+inf" } } }
                                }
                              },
                              secondary: {
                                ts: {
                                  timespan: 0.5,
                                  leftend: 50.5,
                                  rightend: 51.0,
                                  head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-13-4" } } },
                                  at: { temp: { difference: 0.5, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } }
                                }
                              }
                            }
                          },
                          secondary: {
                            ts: {
                              timespan: 1.0,
                              leftend: 51.0,
                              rightend: 52.0,
                              head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-13-5" } } },
                              at: { temp: { difference: 1.0, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } },
                              primary: {
                                ts: {
                                  timespan: 0.5,
                                  leftend: 51.0,
                                  rightend: 51.5,
                                  head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-13-5" } } },
                                  at: { temp: { difference: 1.0, stable: "./../..", pred: { temp: "./../.." }, succ: { temp: "+inf" } } }
                                }
                              },
                              secondary: {
                                ts: {
                                  timespan: 0.5,
                                  leftend: 51.5,
                                  rightend: 52.0,
                                  head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-13-6" } } },
                                  at: { temp: { difference: 0.5, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  secondary: {
                    ts: {
                      timespan: 3.0,
                      leftend: 52.0,
                      rightend: 55.0,
                      head: { chord: { duration: 3.0, velocity: 90, note: { id: "P1-14-1" } } },
                      at: { temp: { difference: 4.0, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } }
                    }
                  }
                }
              },
              secondary: {
                ts: {
                  timespan: 9.0,
                  leftend: 55.0,
                  rightend: 64.0,
                  head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-14-2" } } },
                  at: { temp: { difference: 7.0, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } },
                  primary: {
                    ts: {
                      timespan: 1.0,
                      leftend: 55.0,
                      rightend: 56.0,
                      head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-14-2" } } },
                      at: { temp: { difference: 7.0, stable: "./../..", pred: { temp: "./../.." }, succ: { temp: "+inf" } } },
                      primary: {
                        ts: {
                          timespan: 0.5,
                          leftend: 55.0,
                          rightend: 55.5,
                          head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-14-2" } } },
                          at: { temp: { difference: 7.0, stable: "./../../..", pred: { temp: "./../../.." }, succ: { temp: "+inf" } } }
                        }
                      },
                      secondary: {
                        ts: {
                          timespan: 0.5,
                          leftend: 55.5,
                          rightend: 56.0,
                          head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-14-3" } } },
                          at: { temp: { difference: 0.5, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } }
                        }
                      }
                    }
                  },
                  secondary: {
                    ts: {
                      timespan: 8.0,
                      leftend: 56.0,
                      rightend: 64.0,
                      head: { chord: { duration: 1.0, velocity: 90, note: { id: "P1-15-1" } } },
                      at: { temp: { difference: 1.0, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } },
                      primary: {
                        ts: {
                          timespan: 4.0,
                          leftend: 56.0,
                          rightend: 60.0,
                          head: { chord: { duration: 1.0, velocity: 90, note: { id: "P1-15-1" } } },
                          at: { temp: { difference: 1.0, stable: "./../..", pred: { temp: "./../.." }, succ: { temp: "+inf" } } },
                          primary: {
                            ts: {
                              timespan: 2.0,
                              leftend: 56.0,
                              rightend: 58.0,
                              head: { chord: { duration: 1.0, velocity: 90, note: { id: "P1-15-1" } } },
                              at: { temp: { difference: 1.0, stable: "./../../..", pred: { temp: "./../../.." }, succ: { temp: "+inf" } } },
                              primary: {
                                ts: {
                                  timespan: 1.0,
                                  leftend: 56.0,
                                  rightend: 57.0,
                                  head: { chord: { duration: 1.0, velocity: 90, note: { id: "P1-15-1" } } },
                                  at: { temp: { difference: 1.0, stable: "./../../../..", pred: { temp: "./../../../.." }, succ: { temp: "+inf" } } }
                                }
                              },
                              secondary: {
                                ts: {
                                  timespan: 1.0,
                                  leftend: 57.0,
                                  rightend: 58.0,
                                  head: { chord: { duration: 1.0, velocity: 90, note: { id: "P1-15-2" } } },
                                  at: { temp: { difference: 1.0, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } }
                                }
                              }
                            }
                          },
                          secondary: {
                            ts: {
                              timespan: 2.0,
                              leftend: 58.0,
                              rightend: 60.0,
                              head: { chord: { duration: 1.0, velocity: 90, note: { id: "P1-15-3" } } },
                              at: { temp: { difference: 2.0, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } },
                              primary: {
                                ts: {
                                  timespan: 1.0,
                                  leftend: 58.0,
                                  rightend: 59.0,
                                  head: { chord: { duration: 1.0, velocity: 90, note: { id: "P1-15-3" } } },
                                  at: { temp: { difference: 2.0, stable: "./../..", pred: { temp: "./../.." }, succ: { temp: "+inf" } } }
                                }
                              },
                              secondary: {
                                ts: {
                                  timespan: 1.0,
                                  leftend: 59.0,
                                  rightend: 60.0,
                                  head: { chord: { duration: 1.0, velocity: 90, note: { id: "P1-15-4" } } },
                                  at: { temp: { difference: 1.0, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } }
                                }
                              }
                            }
                          }
                        }
                      },
                      secondary: {
                        ts: {
                          timespan: 4.0,
                          leftend: 60.0,
                          rightend: 64.0,
                          head: { chord: { duration: 4.0, velocity: 90, note: { id: "P1-16-1" } } },
                          at: { temp: { difference: 4.0, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      secondary: {
        ts: {
          timespan: 32.0,
          leftend: 0.0,
          rightend: 32.0,
          head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-5-1" } } },
          at: { temp: { difference: 16.0, stable: 0, pred: { temp: "-inf" }, succ: { temp: 0 } } },
          primary: {
            ts: {
              timespan: 16.0,
              leftend: 16.0,
              rightend: 32.0,
              head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-5-1" } } },
              at: { temp: { difference: 16.0, stable: 0, pred: { temp: "-inf" }, succ: { temp: 0 } } },
              primary: {
                ts: {
                  timespan: 8.0,
                  leftend: 16.0,
                  rightend: 24.0,
                  head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-5-1" } } },
                  at: { temp: { difference: 16.0, stable: 0, pred: { temp: "-inf" }, succ: { temp: 0 } } },
                  primary: {
                    ts: {
                      timespan: 3.5,
                      leftend: 16.0,
                      rightend: 19.5,
                      head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-5-1" } } },
                      at: { temp: { difference: 16.0, stable: 0, pred: { temp: "-inf" }, succ: { temp: 0 } } },
                      primary: {
                        ts: {
                          timespan: 2.0,
                          leftend: 16.0,
                          rightend: 18.0,
                          head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-5-1" } } },
                          at: { temp: { difference: 16.0, stable: 0, pred: { temp: "-inf" }, succ: { temp: 0 } } },
                          primary: {
                            ts: {
                              timespan: 1.5,
                              leftend: 16.0,
                              rightend: 17.5,
                              head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-5-1" } } },
                              at: { temp: { difference: 16.0, stable: 0, pred: { temp: "-inf" }, succ: { temp: 0 } } }
                            }
                          },
                          secondary: {
                            ts: {
                              timespan: 0.5,
                              leftend: 17.5,
                              rightend: 18.0,
                              head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-5-2" } } },
                              at: { temp: { difference: 1.5, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } }
                            }
                          }
                        }
                      },
                      secondary: {
                        ts: {
                          timespan: 1.5,
                          leftend: 18.0,
                          rightend: 19.5,
                          head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-5-3" } } },
                          at: { temp: { difference: 2.0, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } }
                        }
                      }
                    }
                  },
                  secondary: {
                    ts: {
                      timespan: 4.5,
                      leftend: 19.5,
                      rightend: 24.0,
                      head: { chord: { duration: 1.0, velocity: 90, note: { id: "P1-6-1" } } },
                      at: { temp: { difference: 4.0, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } },
                      primary: {
                        ts: {
                          timespan: 4.0,
                          leftend: 20.0,
                          rightend: 24.0,
                          head: { chord: { duration: 1.0, velocity: 90, note: { id: "P1-6-1" } } },
                          at: { temp: { difference: 4.0, stable: "./../..", pred: { temp: "./../.." }, succ: { temp: "+inf" } } },
                          primary: {
                            ts: {
                              timespan: 2.0,
                              leftend: 20.0,
                              rightend: 22.0,
                              head: { chord: { duration: 1.0, velocity: 90, note: { id: "P1-6-1" } } },
                              at: { temp: { difference: 4.0, stable: "./../../..", pred: { temp: "./../../.." }, succ: { temp: "+inf" } } },
                              primary: {
                                ts: {
                                  timespan: 1.0,
                                  leftend: 20.0,
                                  rightend: 21.0,
                                  head: { chord: { duration: 1.0, velocity: 90, note: { id: "P1-6-1" } } },
                                  at: { temp: { difference: 4.0, stable: "./../../../..", pred: { temp: "./../../../.." }, succ: { temp: "+inf" } } }
                                }
                              },
                              secondary: {
                                ts: {
                                  timespan: 1.0,
                                  leftend: 21.0,
                                  rightend: 22.0,
                                  head: { chord: { duration: 1.0, velocity: 90, note: { id: "P1-6-2" } } },
                                  at: { temp: { difference: 1.0, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } }
                                }
                              }
                            }
                          },
                          secondary: {
                            ts: {
                              timespan: 2.0,
                              leftend: 22.0,
                              rightend: 24.0,
                              head: { chord: { duration: 2.0, velocity: 90, note: { id: "P1-6-3" } } },
                              at: { temp: { difference: 2.0, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } }
                            }
                          }
                        }
                      },
                      secondary: {
                        ts: {
                          timespan: 0.5,
                          leftend: 19.5,
                          rightend: 20.0,
                          head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-5-4" } } },
                          at: { temp: { difference: 0.5, stable: "./..", pred: { temp: "-inf" }, succ: { temp: "./.." } } }
                        }
                      }
                    }
                  }
                }
              },
              secondary: {
                ts: {
                  timespan: 8.0,
                  leftend: 24.0,
                  rightend: 32.0,
                  head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-7-1" } } },
                  at: { temp: { difference: 8.0, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } },
                  primary: {
                    ts: {
                      timespan: 4.0,
                      leftend: 24.0,
                      rightend: 28.0,
                      head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-7-1" } } },
                      at: { temp: { difference: 8.0, stable: "./../..", pred: { temp: "./../.." }, succ: { temp: "+inf" } } },
                      primary: {
                        ts: {
                          timespan: 2.0,
                          leftend: 24.0,
                          rightend: 26.0,
                          head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-7-1" } } },
                          at: { temp: { difference: 8.0, stable: "./../../..", pred: { temp: "./../../.." }, succ: { temp: "+inf" } } },
                          primary: {
                            ts: {
                              timespan: 1.5,
                              leftend: 24.0,
                              rightend: 25.5,
                              head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-7-1" } } },
                              at: { temp: { difference: 8.0, stable: "./../../../..", pred: { temp: "./../../../.." }, succ: { temp: "+inf" } } }
                            }
                          },
                          secondary: {
                            ts: {
                              timespan: 0.5,
                              leftend: 25.5,
                              rightend: 26.0,
                              head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-7-2" } } },
                              at: { temp: { difference: 1.5, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } }
                            }
                          }
                        }
                      },
                      secondary: {
                        ts: {
                          timespan: 2.0,
                          leftend: 26.0,
                          rightend: 28.0,
                          head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-7-3" } } },
                          at: { temp: { difference: 2.0, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } },
                          primary: {
                            ts: {
                              timespan: 1.0,
                              leftend: 26.0,
                              rightend: 27.0,
                              head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-7-3" } } },
                              at: { temp: { difference: 2.0, stable: "./../..", pred: { temp: "./../.." }, succ: { temp: "+inf" } } },
                              primary: {
                                ts: {
                                  timespan: 0.5,
                                  leftend: 26.0,
                                  rightend: 26.5,
                                  head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-7-3" } } },
                                  at: { temp: { difference: 2.0, stable: "./../../..", pred: { temp: "./../../.." }, succ: { temp: "+inf" } } }
                                }
                              },
                              secondary: {
                                ts: {
                                  timespan: 0.5,
                                  leftend: 26.5,
                                  rightend: 27.0,
                                  head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-7-4" } } },
                                  at: { temp: { difference: 0.5, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } }
                                }
                              }
                            }
                          },
                          secondary: {
                            ts: {
                              timespan: 1.0,
                              leftend: 27.0,
                              rightend: 28.0,
                              head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-7-5" } } },
                              at: { temp: { difference: 1.0, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } },
                              primary: {
                                ts: {
                                  timespan: 0.5,
                                  leftend: 27.0,
                                  rightend: 27.5,
                                  head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-7-5" } } },
                                  at: { temp: { difference: 1.0, stable: "./../..", pred: { temp: "./../.." }, succ: { temp: "+inf" } } }
                                }
                              },
                              secondary: {
                                ts: {
                                  timespan: 0.5,
                                  leftend: 27.5,
                                  rightend: 28.0,
                                  head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-7-6" } } },
                                  at: { temp: { difference: 0.5, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  secondary: {
                    ts: {
                      timespan: 4.0,
                      leftend: 28.0,
                      rightend: 32.0,
                      head: { chord: { duration: 4.0, velocity: 90, note: { id: "P1-8-1" } } },
                      at: { temp: { difference: 4.0, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } }
                    }
                  }
                }
              }
            }
          },
          secondary: {
            ts: {
              timespan: 16.0,
              leftend: 0.0,
              rightend: 16.0,
              head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-3-1" } } },
              at: { temp: { difference: 8.0, stable: "./..", pred: { temp: "-inf" }, succ: { temp: "./.." } } },
              primary: {
                ts: {
                  timespan: 8.0,
                  leftend: 8.0,
                  rightend: 16.0,
                  head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-3-1" } } },
                  at: { temp: { difference: 8.0, stable: "./../..", pred: { temp: "-inf" }, succ: { temp: "./../.." } } },
                  primary: {
                    ts: {
                      timespan: 4.0,
                      leftend: 8.0,
                      rightend: 12.0,
                      head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-3-1" } } },
                      at: { temp: { difference: 8.0, stable: "./../../..", pred: { temp: "-inf" }, succ: { temp: "./../../.." } } },
                      primary: {
                        ts: {
                          timespan: 2.0,
                          leftend: 8.0,
                          rightend: 10.0,
                          head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-3-1" } } },
                          at: { temp: { difference: 8.0, stable: "./../../../..", pred: { temp: "-inf" }, succ: { temp: "./../../../.." } } },
                          primary: {
                            ts: {
                              timespan: 1.5,
                              leftend: 8.0,
                              rightend: 9.5,
                              head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-3-1" } } },
                              at: { temp: { difference: 8.0, stable: "./../../../../..", pred: { temp: "-inf" }, succ: { temp: "./../../../../.." } } }
                            }
                          },
                          secondary: {
                            ts: {
                              timespan: 0.5,
                              leftend: 9.5,
                              rightend: 10.0,
                              head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-3-2" } } },
                              at: { temp: { difference: 1.5, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } }
                            }
                          }
                        }
                      },
                      secondary: {
                        ts: {
                          timespan: 2.0,
                          leftend: 10.0,
                          rightend: 12.0,
                          head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-3-3" } } },
                          at: { temp: { difference: 2.0, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } },
                          primary: {
                            ts: {
                              timespan: 1.0,
                              leftend: 10.0,
                              rightend: 11.0,
                              head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-3-3" } } },
                              at: { temp: { difference: 2.0, stable: "./../..", pred: { temp: "./../.." }, succ: { temp: "+inf" } } },
                              primary: {
                                ts: {
                                  timespan: 0.5,
                                  leftend: 10.0,
                                  rightend: 10.5,
                                  head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-3-3" } } },
                                  at: { temp: { difference: 2.0, stable: "./../../..", pred: { temp: "./../../.." }, succ: { temp: "+inf" } } }
                                }
                              },
                              secondary: {
                                ts: {
                                  timespan: 0.5,
                                  leftend: 10.5,
                                  rightend: 11.0,
                                  head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-3-4" } } },
                                  at: { temp: { difference: 0.5, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } }
                                }
                              }
                            }
                          },
                          secondary: {
                            ts: {
                              timespan: 1.0,
                              leftend: 11.0,
                              rightend: 12.0,
                              head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-3-5" } } },
                              at: { temp: { difference: 1.0, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } },
                              primary: {
                                ts: {
                                  timespan: 0.5,
                                  leftend: 11.0,
                                  rightend: 11.5,
                                  head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-3-5" } } },
                                  at: { temp: { difference: 1.0, stable: "./../..", pred: { temp: "./../.." }, succ: { temp: "+inf" } } }
                                }
                              },
                              secondary: {
                                ts: {
                                  timespan: 0.5,
                                  leftend: 11.5,
                                  rightend: 12.0,
                                  head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-3-6" } } },
                                  at: { temp: { difference: 0.5, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  secondary: {
                    ts: {
                      timespan: 4.0,
                      leftend: 12.0,
                      rightend: 16.0,
                      head: { chord: { duration: 4.0, velocity: 90, note: { id: "P1-4-1" } } },
                      at: { temp: { difference: 4.0, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } }
                    }
                  }
                }
              },
              secondary: {
                ts: {
                  timespan: 8.0,
                  leftend: 0.0,
                  rightend: 8.0,
                  head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-1-1" } } },
                  at: { temp: { difference: 8.0, stable: "./..", pred: { temp: "-inf" }, succ: { temp: "./.." } } },
                  primary: {
                    ts: {
                      timespan: 3.5,
                      leftend: 0.0,
                      rightend: 3.5,
                      head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-1-1" } } },
                      at: { temp: { difference: 8.0, stable: "./../..", pred: { temp: "-inf" }, succ: { temp: "./../.." } } },
                      primary: {
                        ts: {
                          timespan: 2.0,
                          leftend: 0.0,
                          rightend: 2.0,
                          head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-1-1" } } },
                          at: { temp: { difference: 8.0, stable: "./../../..", pred: { temp: "-inf" }, succ: { temp: "./../../.." } } },
                          primary: {
                            ts: {
                              timespan: 1.5,
                              leftend: 0.0,
                              rightend: 1.5,
                              head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-1-1" } } },
                              at: { temp: { difference: 8.0, stable: "./../../../..", pred: { temp: "-inf" }, succ: { temp: "./../../../.." } } }
                            }
                          },
                          secondary: {
                            ts: {
                              timespan: 0.5,
                              leftend: 1.5,
                              rightend: 2.0,
                              head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-1-2" } } },
                              at: { temp: { difference: 1.5, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } }
                            }
                          }
                        }
                      },
                      secondary: {
                        ts: {
                          timespan: 1.5,
                          leftend: 2.0,
                          rightend: 3.5,
                          head: { chord: { duration: 1.5, velocity: 90, note: { id: "P1-1-3" } } },
                          at: { temp: { difference: 2.0, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } }
                        }
                      }
                    }
                  },
                  secondary: {
                    ts: {
                      timespan: 4.5,
                      leftend: 3.5,
                      rightend: 8.0,
                      head: { chord: { duration: 1.0, velocity: 90, note: { id: "P1-2-1" } } },
                      at: { temp: { difference: 4.0, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } },
                      primary: {
                        ts: {
                          timespan: 4.0,
                          leftend: 4.0,
                          rightend: 8.0,
                          head: { chord: { duration: 1.0, velocity: 90, note: { id: "P1-2-1" } } },
                          at: { temp: { difference: 4.0, stable: "./../..", pred: { temp: "./../.." }, succ: { temp: "+inf" } } },
                          primary: {
                            ts: {
                              timespan: 2.0,
                              leftend: 4.0,
                              rightend: 6.0,
                              head: { chord: { duration: 1.0, velocity: 90, note: { id: "P1-2-1" } } },
                              at: { temp: { difference: 4.0, stable: "./../../..", pred: { temp: "./../../.." }, succ: { temp: "+inf" } } },
                              primary: {
                                ts: {
                                  timespan: 1.0,
                                  leftend: 4.0,
                                  rightend: 5.0,
                                  head: { chord: { duration: 1.0, velocity: 90, note: { id: "P1-2-1" } } },
                                  at: { temp: { difference: 4.0, stable: "./../../../..", pred: { temp: "./../../../.." }, succ: { temp: "+inf" } } }
                                }
                              },
                              secondary: {
                                ts: {
                                  timespan: 1.0,
                                  leftend: 5.0,
                                  rightend: 6.0,
                                  head: { chord: { duration: 1.0, velocity: 90, note: { id: "P1-2-2" } } },
                                  at: { temp: { difference: 1.0, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } }
                                }
                              }
                            }
                          },
                          secondary: {
                            ts: {
                              timespan: 2.0,
                              leftend: 6.0,
                              rightend: 8.0,
                              head: { chord: { duration: 2.0, velocity: 90, note: { id: "P1-2-3" } } },
                              at: { temp: { difference: 2.0, stable: "./..", pred: { temp: "./.." }, succ: { temp: "+inf" } } }
                            }
                          }
                        }
                      },
                      secondary: {
                        ts: {
                          timespan: 0.5,
                          leftend: 3.5,
                          rightend: 4.0,
                          head: { chord: { duration: 0.5, velocity: 90, note: { id: "P1-1-4" } } },
                          at: { temp: { difference: 0.5, stable: "./..", pred: { temp: "-inf" }, succ: { temp: "./.." } } }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
